import { useSearchParams } from "react-router-dom";
import FullQuearyDetail from "../components/CustomerSupportPage/FullQuearyDetail"
import Layout from "../components/Layout/Layout"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GetAuthData, getSupportDetails } from "../lib/store";
import Loading from "../components/Loading";

const CustomerSupportDetails = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [deatilsId, setDetailsId] = useState(searchParams.get("id"));
    const [detailsData,setDetailsData] = useState({})
    const [isLoaded, setLoaded] = useState(false)
    useEffect(()=>{
        GetAuthData().then((user)=>{
            let rawData = {key:user.x_access_token,caseId:deatilsId}
            getSupportDetails({rawData}).then((deatils)=>{
                deatils.salesRepName = user.Name;
                setDetailsData(deatils);
                setLoaded(true);
            }).catch((err)=>{
                console.error({err});
            })
        }).catch((error)=>{
            console.error({error});
        })
    },[deatilsId])
    if(!deatilsId || deatilsId == "") return navigate("/customer-support")
    if(!isLoaded) return <Loading />
    return (
        <Layout>
            <div>
                <div className="col-12">
                    <div className="filter-container  ">
                    </div>
                </div>
                <div>
                    <FullQuearyDetail data={detailsData}/>
                </div>
            </div>
        </Layout>
    )
}
export default CustomerSupportDetails