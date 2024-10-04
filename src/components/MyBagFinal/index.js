
const express = require('express');

const axios = require('axios');
const router = express.Router();
const instance_url = "https://beautyfashionsales--dx.sandbox.my.salesforce.com";


function getInitials(name) {
  const words = name.split(' ');

  if (words.length === 1) {
    const word = words[0];
    return word[0].toUpperCase() + word[word.length - 1].toUpperCase();
  } else {
    return words[0][0].toUpperCase() + words[1][0].toUpperCase();
  }
}
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}${month}`;
}

router.post('/generatepo', async (req, res) => {
  const { accountName, manufacturerName, orderDate, accountId, manufacturerId } = req.body;

  if (!accountName || !manufacturerName || !accountId || !manufacturerId) {
    return res.status(400).json({ success: false, message: 'Account name, manufacturer name, account ID, and manufacturer ID are required.' });
  }

  try {
    const formattedDate = formatDate(orderDate);
    const accountInitials = getInitials(accountName);
    const manufacturerInitials = getInitials(manufacturerName);
    const poPrefix = `${accountInitials}${manufacturerInitials}${formattedDate}`;

    const authResponse = await axios.post(`${process.env.Origin}/beauty/login`);
    const accessToken = authResponse.data.data.access_token;

    if (!accessToken) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const query = `SELECT PO_Number__c FROM Opportunity WHERE AccountId='${accountId}' AND ManufacturerId__c='${manufacturerId}' AND CreatedDate = TODAY ORDER BY PO_Number__c ASC`;
    const encodedQuery = encodeURIComponent(query);

    const opportunitiesResponse = await axios.get(`${instance_url}/services/data/v56.0/query?q=${encodedQuery}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const opportunities = opportunitiesResponse.data.records;
    let matchingPoNumbers = opportunities
      .filter(opportunity =>
        opportunity.PO_Number__c &&
        opportunity.PO_Number__c.startsWith(poPrefix) &&
        /^\w+\d{2}$/.test(opportunity.PO_Number__c)
      );

    let nextPoNumber = '01';  
    if (matchingPoNumbers.length > 0) {
      const lastPoNumber = matchingPoNumbers
        .map(opportunity => opportunity.PO_Number__c)
        .sort()
        .pop();

 const numericPart = lastPoNumber.slice(poPrefix.length)
 
const currentNumber = parseInt(numericPart, 10);

      if (currentNumber >= 1000) {
        nextPoNumber = (currentNumber + 1).toString().padStart(numericPart.length, '0'); 
      } else {
        nextPoNumber = (currentNumber + 1).toString().padStart(2, '0'); 
      }
    }

  
    const poNumber = `${poPrefix}${nextPoNumber}`;

    res.json({ success: true, poNumber });
    console.log(`Generated PO Number: ${poNumber}`);

  } catch (error) {
    console.error('Error generating PO number:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.response ? error.response.data : error.message
    });
  }
});


module.exports = router;



