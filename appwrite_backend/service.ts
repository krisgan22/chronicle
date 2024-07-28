import { Client, Account, ID, Databases, Query  } from 'react-native-appwrite'

const client = new Client();

const API_ENDPOINT: string = process.env.EXPO_PUBLIC_API_ENDPOINT!;
const PROJECT_ID: string = process.env.EXPO_PUBLIC_PROJECT_ID!;
const DATABASE_ID: string = process.env.EXPO_PUBLIC_DATABASE_ID!;
const USERS_COLLECTION_ID: string = process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!;
const ORG_COLLECTION_ID: string = process.env.EXPO_PUBLIC_ORG_COLLECTION_ID!;
const JOIN_REQUESTS_COLLECTION_ID: string = process.env.EXPO_PUBLIC_JOIN_REQUESTS_COLLECTION_ID!;
const ACTIVITY_COLLECTION_ID: string = process.env.EXPO_PUBLIC_ACTIVITY_COLLECTION_ID!;

client
.setEndpoint(API_ENDPOINT)
.setProject(PROJECT_ID)

const account = new Account(client);
const databases = new Databases(client);

export async function signUpAccount(email: string, password: string, username: string, first_name: string, last_name: string, phone_num:string, employer:string, matching_rate: number) {
    try {
        // check if username already exists
        const usernameExists = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal("username", [username])]
        )
        console.log("username exists: ", usernameExists);
        if (usernameExists.total !== 0)
        {
            return undefined;
        }

        const newAccount = await account.create(ID.unique(), email, password, username);
        if (newAccount) {
            // sign in and create email session
            if (newAccount) {
                // create instance of user in database with attributes too
                const newUser = await databases.createDocument(
                    DATABASE_ID, 
                    USERS_COLLECTION_ID, 
                    ID.unique(), 
                    {
                        userID: newAccount.$id,
                        first_name: first_name,
                        last_name: last_name,
                        username: username,
                        phone_num: phone_num,
                        email: email,
                        employer:employer,
                        matching_rate: matching_rate
                    });
                
                const result = await signInAccountCreateSession(email, password);
                return result;

            } else 
            {
                return null;
            }
        }
    } catch (error) {
        console.log("Appwrite: signUpAccount(): ", error);
        // Snackbar.show({text: String(error), duration: Snackbar.LENGTH_LONG}); 
    }
}

export async function signInAccountCreateSession(email: string, password: string) {
    try {
        const session_result =  await account.createEmailPasswordSession(
            email,
            password
        );
        console.log("Session created: ", session_result);

        const userQuery = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal("userID", [session_result.userId])]
        )
        console.log("User Query: ", userQuery);

        // returning array containing session information and user information
        return {session: session_result, user: userQuery.documents[0]}

    } catch (error) {
        console.log("service: signInAccountCreateSession(): ", error);
        // Snackbar.show({text: String(error), duration: Snackbar.LENGTH_LONG});
        try {
            // try to retrieve email for a username if the user tried to login with a username
            const userQuery = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.equal("username", [email])]
            )
            console.log("service: signInAccountCreateSession(): Attempting username login...");
            const session_result =  await account.createEmailPasswordSession(
                userQuery.documents[0]["email"],
                password
            );
            console.log("Session created: ", session_result);
            console.log("User Query: ", userQuery);

            // returning array containing session information and user information
           return {session: session_result,  user: userQuery.documents[0]}
        } catch (error)
        {
            console.log("service: signInAccountCreateSession(): ", error);
        }
    }
}

export async function getCurrentUser() {
    try {
        const currentAcc = await account.get();
        if (!currentAcc) throw new Error("Error getting account");

        const userQuery = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal("userID", [currentAcc.$id])]
        )
        if (!userQuery) throw new Error("User collection query failure");

        return userQuery.documents[0];

    } catch (error) {
        console.log("service.ts: getCurrentUser(): ", error);
        // Snackbar.show({text: String(error), duration: Snackbar.LENGTH_LONG}); 
    }        
}

export async function getCurrentSession() {
    try {
        const result = await account.getSession('current');
        return result

    } catch (error) {
        console.log("service.ts: getCurrentSession(): ", error);
        // Snackbar.show({text: String(error), duration: Snackbar.LENGTH_LONG}); 
    }        
}

export async function signOutAccountDeleteSession()
{
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        console.log("service.ts: signOutAccountDeleteSession(): ", error);
        // Snackbar.show({text: String(error), duration: Snackbar.LENGTH_LONG}); 
    }     
}

export async function getOrganizations()
{
    try {
        const orgQuery = await databases.listDocuments(
            DATABASE_ID,
            ORG_COLLECTION_ID,
        )
        return orgQuery.documents;
    } catch (error) {
        console.log("service.ts: getOrganizations(): ", error);
    }
}

export async function getOrgTasks(orgID: any)
{
    try {
        const orgTaskQuery = await databases.listDocuments(
            DATABASE_ID,
            ORG_COLLECTION_ID,
            [Query.equal("$id", [orgID])]
        );
        console.log("service.ts: getOrgTasks(): ", orgTaskQuery)
        const formattedTasks = orgTaskQuery.documents[0]['tasks'].map((task: string) => ({ taskName: task}))
        // return orgTaskQuery.documents[0]['tasks'];
        return formattedTasks;
    } catch (error) {
        console.log("service.ts: getOrgTasks(): ", error);
    }
}

export async function requestJoinOrg(userID: any, orgID: any)
{
    try {
        console.log("userID: ", userID);
        console.log("orgID: ", orgID);
        const checkExistsResult = await databases.listDocuments(
            DATABASE_ID,
            JOIN_REQUESTS_COLLECTION_ID,
            [Query.equal("orgID", [orgID]),
             Query.equal("userID", [userID])]
        )
        if (checkExistsResult.total === 0)
        {
            const currentTime = new Date();
            const joinRequestResult = await databases.createDocument(
                DATABASE_ID,
                JOIN_REQUESTS_COLLECTION_ID,
                ID.unique(),
                {
                    orgID: orgID,
                    userID: userID,
                    date_created: currentTime.toISOString(),
                    date_updated: currentTime.toISOString(),
                    // Change this to pending after we complete the mentor / board member flow
                    status: "accepted",
                });
            console.log("service.ts: requestJoinOrg(): ", joinRequestResult);
            return joinRequestResult;
        } else
        {
            console.log(`service.ts: requestJoinOrg(): Request for ${userID} to join ${orgID} already exists.`);
            return null;
        }
    } catch (error) {
        console.error("service.ts: requestJoinOrg(): ", error);
    }
}

export async function joinedOrgs(userID: any) {
    try {
        const joinedOrgsQuery = await databases.listDocuments(
            DATABASE_ID,
            JOIN_REQUESTS_COLLECTION_ID,
            [Query.equal("userID", [userID]),
            Query.equal("status",["accepted"])]
        )
        if (joinedOrgsQuery) {
            let orgList: any[] = [];
            joinedOrgsQuery.documents.forEach(item => orgList.push(item.orgID))
            console.log("service.ts: joinedOrgs(): ", orgList)
            
            const getOrgResult = await databases.listDocuments(
                DATABASE_ID,
                ORG_COLLECTION_ID,
                [Query.equal("$id", orgList)]
            )
            
            console.log("service.ts: joinedOrgs(): ", getOrgResult)
            return getOrgResult.documents
        }
        return null;
    } catch (error) {
        console.log("service.ts: joinedOrgs(): ", error);
    }
}

export async function submitActivity(userID: any, orgID: any, taskName: any, desc: any, start_date: string, end_date: string)
{
    try {
        const activityResult = await databases.createDocument(
            DATABASE_ID,
            ACTIVITY_COLLECTION_ID,
            ID.unique(),
            {
                desc: desc,
                userID: userID,
                orgID: orgID,
                taskName: taskName,
                start_date: start_date,
                end_date: end_date,
                submittedDate: new Date().toISOString()
            });
            console.log("service.ts: submitActivity(): ", activityResult);
            return activityResult;
    } catch (error) {
        console.error("service.ts: submitActivity(): ", error);
    }
}

export async function leaveOrg(userID: any, orgID: any)
{
    try {
        const getIDQuery = await databases.listDocuments(
            DATABASE_ID,
            JOIN_REQUESTS_COLLECTION_ID,
            [Query.equal("userID", [userID]),
             Query.equal("orgID", [orgID])]
        )
        console.log("service.ts: leaveOrg(): ", getIDQuery);
        if(getIDQuery && getIDQuery.total === 1)
        {
            const deleteResult = await databases.deleteDocument(
                DATABASE_ID,
                JOIN_REQUESTS_COLLECTION_ID,
                getIDQuery.documents[0].$id
            );
            console.log("service.ts: leaveOrg(): ", deleteResult)
            return deleteResult;
        }
        console.error("service.ts: leaveOrg(): ", getIDQuery);
        return undefined;
    } catch (error) {
        console.error("service.ts: leaveOrg(): ", error);
    }
}

export async function getSubmittedActivities(userID: any, orgID: any)
{
    try {
        const activityQuery = await databases.listDocuments(
            DATABASE_ID,
            ACTIVITY_COLLECTION_ID,
            [Query.equal("userID", [userID]),
             Query.equal("orgID", [orgID])]
        )
        console.log("service.ts: getSubmittedActivities(): ", activityQuery);
        return activityQuery.documents
    } catch (error) {
        console.log("service.ts: getSubmittedActivities(): ", error)
    }
}

export async function deleteActivity(taskID: any)
{
    try {
        const deleteRequest = await databases.deleteDocument(
            DATABASE_ID,
            ACTIVITY_COLLECTION_ID,
            taskID
        )
        return deleteRequest;
    } catch (error) {
        console.log(error);
    }
}

export async function updateActivity(taskID: any, userID: any, orgID: any, taskName: any, desc: any, start_date: string, end_date: string)
{
    try {
        const activityResult = await databases.updateDocument(
            DATABASE_ID,
            ACTIVITY_COLLECTION_ID,
            taskID,
            {
                desc: desc,
                userID: userID,
                orgID: orgID,
                taskName: taskName,
                start_date: start_date,
                end_date: end_date,
                submittedDate: new Date().toISOString()
            });
            console.log("service.ts: submitActivity(): ", activityResult);
            return activityResult;
    } catch (error) {
        console.error("service.ts: submitActivity(): ", error);
    }
}

export async function checkExistenceInUserTable(attribute: any, attributeValue: any) {
    try {
        const checkResult = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal(attribute, [attributeValue])]
        )
        return checkResult;
    } catch (error) {
        console.log("service.ts: checkExistenceInUserTable(): ", error)
    }
}