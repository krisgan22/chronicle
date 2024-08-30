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
        const formattedTasks = orgTaskQuery.documents[0]['tasks'].map((task: string, index: number) => ({ taskName: task, id: index}))
        // return orgTaskQuery.documents[0]['tasks'];
        return formattedTasks;
    } catch (error) {
        console.log("service.ts: getOrgTasks(): ", error);
    }
}

export async function setOrgTasks(orgID: any, taskList: string[])
{
    try {
        const setTaskRequest = await databases.updateDocument(
            DATABASE_ID,
            ORG_COLLECTION_ID,
            orgID,
            {
                tasks: taskList
            }
        );
        console.log(setTaskRequest);
        return setTaskRequest;
    } catch (error) {
        console.log("service.ts: setOrgTasks(): ", error);
    }
}

export async function requestJoinOrg(username: any, userID: any, orgName : any, orgID: any)
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
                    status: "pending",
                    orgName: orgName,
                    username: username
                });
            console.log("service.ts: requestJoinOrg(): ", joinRequestResult);
            return checkExistsResult;
        } else
        {
            console.log(`service.ts: requestJoinOrg(): Request for ${userID} to join ${orgID} already exists.`);
            return checkExistsResult;
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

export async function joinedOrgsAndContributions(userID: any, matching_rate: any) {
    try {
        const joinedOrgsQuery = await databases.listDocuments(
            DATABASE_ID,
            JOIN_REQUESTS_COLLECTION_ID,
            [Query.equal("userID", [userID]),
            Query.equal("status",["accepted"])]
        )
        console.log("service.ts: joinedOrgsAndContributions(): joinedOrgsQuery: ", joinedOrgsQuery);
        if (joinedOrgsQuery) {
            if (joinedOrgsQuery.total === 0) {
                console.log("service.ts: NO ORGS");
                return {};
            }
            let orgList: any[] = [];
            let contributionObject: { [key: string]: any } = {}
            
            await Promise.all(joinedOrgsQuery.documents.map(async item => {
                orgList.push(item.orgID)
                contributionObject[item.orgID] = await getContributionsToOrg(userID, item.orgID, matching_rate);
            }));

            console.log("service.ts: joinedOrgsAndContributions(): ", contributionObject);
            console.log("service.ts: joinedOrgsAndContributions(): ", orgList)
            
            const getOrgResult = await databases.listDocuments(
                DATABASE_ID,
                ORG_COLLECTION_ID,
                [Query.equal("$id", orgList)]
            )
            
            console.log("service.ts: joinedOrgsAndContributions(): ", getOrgResult)
            // return getOrgResult.documents
            return {orgs: getOrgResult.documents, contributions: contributionObject}
        }
        return null;
    } catch (error) {
        console.log("service.ts: joinedOrgsAndContributions(): ", error);
    }
}

export async function submitActivity(userID: any, orgID: any, taskName: any, desc: any, start_date: string, end_date: string, user_first_name: string, user_last_name: string)
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
                submittedDate: new Date().toISOString(),
                user_first_name: user_first_name,
                user_last_name: user_last_name,
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

export async function getAllSubmittedActivities(orgID: any)
{
    try {
        const activityQuery = await databases.listDocuments(
            DATABASE_ID,
            ACTIVITY_COLLECTION_ID,
            [Query.equal("orgID", [orgID])]
        )
        console.log("service.ts: getAllSubmittedActivities(): ", activityQuery);
        return activityQuery.documents
    } catch (error) {
        console.log("service.ts: getAllSubmittedActivities(): ", error)
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
                // submittedDate: new Date().toISOString(),
                taskStatus: "pending",
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

export async function getContributionsToOrg(userID: any, orgID: any, matching_rate: any) {
    try {
        const contributionResult = await databases.listDocuments(
            DATABASE_ID,
            ACTIVITY_COLLECTION_ID,
            [
                Query.equal("userID", [userID]),
                Query.equal("orgID", [orgID]),
                Query.equal("taskStatus", ['pending', 'approved'])
            ]
        )
        console.log("service.ts: getContributionsToOrg")
        if (contributionResult) {
            // let hours: number = 0;
            let timeString: string = ""
            let money: number = 0;
            let totalMs: number = 0
            contributionResult.documents.forEach(item => 
                {
                    const startDate = new Date(item.start_date);
                    const endDate = new Date(item.end_date);
                    const diffInMs = Math.abs(endDate.getTime() - startDate.getTime());
                    totalMs += diffInMs;
                }
            )
            const diffInHours = totalMs / (1000 * 60 * 60);
            // hours += diffInHours;

            // Convert milliseconds to total minutes
            const totalMinutes = Math.floor(totalMs / (1000 * 60));

            // Calculate hours and remaining minutes
            const calcHours = Math.floor(totalMinutes / 60);
            const calcMinutes = totalMinutes % 60;

              // Construct the output string with correct plurality
            const hoursString = calcHours === 1 ? "1hr" : `${calcHours}hrs`;
            const minutesString = calcMinutes === 1 ? "1min" : `${calcMinutes}mins`;
            
            if (calcHours === 0) {
                timeString = minutesString;
            } else if (calcMinutes === 0) {
            timeString = hoursString;
            } else {
            timeString = `${hoursString} ${minutesString}`;
            }

            if (matching_rate) {
                money = matching_rate * diffInHours;
            }
            return {hours: timeString, money: money};
        }
        return {hours: 0, money: 0}
    } catch (error) {
        console.log("service.ts: getContributionsToOrg(): ", error);
    }
}

export async function getOrgMembers(orgID: any) {
    try {
        const memberRequest = await databases.listDocuments(
            DATABASE_ID,
            JOIN_REQUESTS_COLLECTION_ID,
            [Query.equal("orgID", [orgID])]
        )

        let memberIDList : string[] = [];
        if (memberRequest) {
            memberRequest.documents.forEach(element => {
                memberIDList.push(element.userID)
            });
        }

        const idMappedMemberRequest = memberRequest.documents.reduce((acc : any, obj: any) => {
            acc[obj.userID] = obj;
            return acc;
          }, {});

        const memberDetailsRequest = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal("userID", memberIDList)]
        )
        return [memberDetailsRequest, idMappedMemberRequest];

    } catch (error) {
        console.log("service.ts: getOrgMembers(): ", error);
    }
}

export async function acceptUserOrgJoinRequest(userID: any, orgID: any, privilege: string = "volunteer")
{
    try {
        const findRequest = await databases.listDocuments(
            DATABASE_ID,
            JOIN_REQUESTS_COLLECTION_ID,
            [Query.equal("userID", [userID]),
             Query.equal("orgID", [orgID])]
        )

        const updateRequest = await databases.updateDocument(
            DATABASE_ID,
            JOIN_REQUESTS_COLLECTION_ID,
            findRequest.documents[0].$id,
            {
                status: "accepted",
                privilege: privilege
            }
        )

        return updateRequest;
        
    } catch (error) {
        console.log("service.ts: acceptUserOrgJoinRequest(): ", error);
    }
}

export async function acceptUserOrgJoinRequestWithID(requestID: string, privilege: string = "volunteer")
{
    try {
        const updateRequest = await databases.updateDocument(
            DATABASE_ID,
            JOIN_REQUESTS_COLLECTION_ID,
            requestID,
            {
                status: "accepted",
                privilege: privilege
            }
        )

        return updateRequest;
        
    } catch (error) {
        console.log("service.ts: acceptUserOrgJoinRequest(): ", error);
    }
}

export async function getCurrentUserOrgPrivilege(userID: any, orgID: any)
{
    try {
        const privilegeRequest = await databases.listDocuments(
            DATABASE_ID,
            JOIN_REQUESTS_COLLECTION_ID,
            [
                Query.equal("userID", userID),
                Query.equal("orgID", orgID)
            ]
        )
        return privilegeRequest.documents[0].privilege
    } catch (error) {
        console.log("service.ts: getCurrentUserOrgPrivilege(): ", error);
    }
}

export async function decideTimesheet(timesheetID: any, approverID: any, approver_first_name: any, approver_last_name: any, text_response: any = "", decision: string)
{
    try {
        const updateTimesheetRequest = await databases.updateDocument(
            DATABASE_ID,
            ACTIVITY_COLLECTION_ID,
            timesheetID,
            {
                "taskStatus": decision,
                "approverID": approverID,
                "approver_first_name": approver_first_name,
                "approver_last_name": approver_last_name,
                "text_response":text_response,
                "approver_update_date": new Date().toISOString(),
            }
        )
    } catch (error) {
        console.log("service.ts: decideTimesheet(): ", error)
        
    }
}