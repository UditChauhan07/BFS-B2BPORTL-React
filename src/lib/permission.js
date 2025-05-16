
import { DestoryAuth, GetAuthData } from "./store";
let defaultPermission = {
  modules: {
    godLevel: false,
    store: {
      view: true
    },
    order: {
      view: true,
      create: true,
    },
    emailBlast: {
      view: false,
      create: false,
    },
    newArrivals: {
      view: true,
    },
    brands: {
      view: true
    },
    dashboard: {
      view: true,
      redirect: true
    },
    topProducts: {
      view: true,
      create: true,
    },
    marketingCalender: {
      view: true,
      create: true,
    },
    educationCenter: {
      view: true,
      create: true,
    },
    customerSupport: {
      view: true,
      create: true,
      childModules: {
        order_Status: {
          view: true,
          create: true
        },
        customer_service: {
          view: true,
          create: true
        },
        brandManagementApproval: {
          view: true,
          create: true
        },
        how_To_Guide: {
          view: true,
        }
      },
    },
    reports: {
      hasAccess: true,
      salesReport: {
        view: true,
      },
      newnessReport: {
        view: true,
      },
      comparisonReport: {
        view: true,
      },
      yearlyComparisonReport: {
        view: true,
      },
      targetReport: {
        view: true,
      },
      contactDetailedReport: {
        view: true,
      },
      accountTier: {
        view: false,
      },
      auditReport: {
        view: false,
        create: false,
        specify: true
      },
    },
  },
}
// Get permissions based on logged in user
export async function getPermissions() {
  const authData = await GetAuthData();

  if (!authData) {
    console.log("No auth data found, or session expired.");
    DestoryAuth();
    return null;
  }
  

  let userPermissions =  defaultPermission;
  if(authData?.permission){
    userPermissions= defaultPermission
  }

  if (!userPermissions) {
    console.log("Permissions not found for the user type.");
    userPermissions= defaultPermission
    return null;
  }

  return userPermissions;
}
