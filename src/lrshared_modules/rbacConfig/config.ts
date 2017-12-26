// Checks if mapped authority exists in authorities array (from login)

const checkAuthority = function (value: String) {
    try {
        const auth = localStorage.getItem('authorities') ? JSON.parse(localStorage.getItem('authorities')) : [];
        const selectedProgram = localStorage.getItem('selectedProgram') ? JSON.parse(localStorage.getItem('selectedProgram'))['programId'] : '';
        if (selectedProgram) {
            return (auth[selectedProgram].indexOf(value) > 0) ? true : false;
        } else {
            let getStatus = false;
            let isUnauthorizedCount = 0;
            Object.keys(auth)
                .forEach(function eachKey(key) {
                    if (auth[key].indexOf(value) > 0) {
                        getStatus = true;
                        return true;
                    } else {
                        ++isUnauthorizedCount;
                    }
                });
                return (isUnauthorizedCount > 0) ? false : getStatus;
        }
    } catch (ex) {
        // console.log(ex);
    }
};

// Action to Service array
const actionToService = {
    // Enums
    enums: 'listMaster',

    // Dashboard
    showDashboard: 'overview',
    showAllProgramsTickets: 'priorityTickets',

    // Members
    showMembers: 'getCustomerAdhoc',
    customerInfo: 'getCustomerById',
    transactions: 'getCustomerAccruals',
    expired: 'getCustomerCommunications',
    communication: 'getCustomerCommunications',
    getCourtesyPointForCustomer: 'getCourtesyPointForCustomer',
    customerTickets: 'getAllTickets',
    giveCourtesyPoints: 'postPoint',
    redemption: '',

    // Tickets
    showTickets: 'getAllTickets',
    searchTickets: 'getAllTickets',
    getTicketDetails: 'getTicketById',
    createTicket: 'createTicket',
    editTicket: 'createTicket',
    createComment: 'createComment',
    assignTicket: 'assignTicketToAgent',

    // User Management
    showUserManagement: 'resolvedusersbyprogramandapplication',
    getUsers: 'resolvedusersbyprogramandapplication',
    addRoles: 'assignrolestoresolveduser',
    
    // courtesy Point
    showCourtesyPoint: 'getCourtesyPointForAgent',
    
    // Programs
    getPrograms: 'getProgramsForAgent',
    
    // Route
    courtesyPoint: 'getCourtesyPointForAgent',
    addUser: 'adduser',
    editUser: 'updateuser',
    userManagement: 'resolvedusersbyprogramandapplication',
    tickets: 'getAllTickets',
    ticketDetails: 'getTicketById',
    members: 'getCustomerAdhoc',
    memberDetails: 'getCustomerById',
    dashboard: 'overview'
};

// check for authorities
export const getAuthority = function (action): boolean {
    try {
        if (actionToService[action]) {
            return actionToService[action] === 'overview' ? true : checkAuthority(actionToService[action]);
        } else {
            // If not action not found in actionToService array give authority
            return false;
        }
    } catch (ex) {
        // console.log(ex);
        return false;
    }
};

// {"624a03ca-a0e0-47f7-b1fe-11110f263297":["assignProgramToAgent","getTicketsForProgram","getCommentsForTickets","getProgramById","createAgent","createComment","getCustomerCommunications","getCustomerById","getAllAgents","listMaster","createCategory","getCustomerAccruals","assignTicketToAgent","overview","getAgentsForProgram","getCustomerAdhoc","getTicketsForAgent","getAccrualDetails","getTicketById","getAgentByEmail","getAllTickets","getCommentById","createTicket","getProgramsForAgent","getCustomerRedemptions","getAllPrograms"],"b0d9e8ac-e4ef-4b1d-995b-1b398d0db623":["assignProgramToAgent","getTicketsForProgram","getCommentsForTickets","getProgramById","createAgent","createComment","getCustomerCommunications","getCustomerById","getAllAgents","listMaster","createCategory","getCustomerAccruals","assignTicketToAgent","overview","getAgentsForProgram","getCustomerAdhoc","getTicketsForAgent","getAccrualDetails","getTicketById","getAgentByEmail","getAllTickets","getCommentById","createTicket","getProgramsForAgent","getCustomerRedemptions","getAllPrograms"],"0bfa14f2-55ce-46f3-909e-266f1c892c16":["assignProgramToAgent","getTicketsForProgram","getCommentsForTickets","getProgramById","createAgent","createComment","getCustomerCommunications","getCustomerById","getAllAgents","listMaster","createCategory","getCustomerAccruals","assignTicketToAgent","overview","getAgentsForProgram","getCustomerAdhoc","getTicketsForAgent","getAccrualDetails","getTicketById","getAgentByEmail","getAllTickets","getCommentById","createTicket","getProgramsForAgent","getCustomerRedemptions","getAllPrograms"]}
