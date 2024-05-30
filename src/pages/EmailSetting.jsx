import { useEffect, useMemo, useState } from "react"
import AppLayout from "../components/AppLayout"
import { DateConvert, GetAuthData, admins, getEmailBlast } from "../lib/store";
import { useNavigate } from "react-router-dom";
import LoaderV2 from "../components/loader/v2";
import { BiLoader } from "react-icons/bi";
import Pagination from "../components/Pagination/Pagination";
import EmailTable from "../components/EmailBlasts/EmailTable";
import Loading from "../components/Loading";
let PageSize = 10;
const EmailSetting = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [contactList, setContactList] = useState({ isLoaded: false, data: [] })
    const [notifyDate, setNotifyDate] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [setting, setSetting] = useState(false)

    useEffect(() => {
        GetAuthData().then((user) => {
            if (admins.includes(user.Sales_Rep__c)) {
                setUser(user)
                getEmailBlast({ key: user.access_token, Id: user.Sales_Rep__c }).then((list) => {
                    setContactList({ isLoaded: true, data: list.notifyMail })
                    setNotifyDate(list.notifyDate)
                }).catch((conErr) => {
                    console.log({ conErr });
                })
            } else {
                navigate('/dashboard')
            }
        }).catch((err) => {
            console.log({ err });
        })
    }, [])
    const { isLoaded, data } = contactList
    console.log(
        { data }
    );
    const [searchValue, setSearchValue] = useState();
    const mailList = useMemo(() => {
        return (
            data
                ?.filter((contact) => {
                    return (
                        !searchValue?.length ||
                        contact.Account?.toLowerCase().includes(
                            searchValue.toLowerCase()
                        ) || contact.Brands?.toLowerCase().includes(
                            searchValue.toLowerCase()
                        ) || contact.ContactEmail?.toLowerCase().includes(
                            searchValue.toLowerCase()
                        )
                    );
                })
        );
    }, [data,searchValue]);

    return (<AppLayout>
        {isLoaded ? <div>
            <div style={{ width: '80%', margin: 'auto' }}>
                <EmailTable data={mailList.slice(
                    (currentPage - 1) * PageSize,
                    currentPage * PageSize
                )} setSetting={setSetting} setting={setting} setSearchValue={setSearchValue} />
                {!setting && <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={mailList.length}
                    pageSize={PageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                />}
            </div>
        </div> : <Loading height={'60vh'} />}
    </AppLayout>)
}
export default EmailSetting