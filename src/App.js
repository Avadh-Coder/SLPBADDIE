import React, { useState, useEffect, createContext, useContext } from 'react';

// Define the ADMIN_PLAYER_NUMBER. This player number will have admin access initially for dummy data.
const ADMIN_PLAYER_NUMBER = "015";

// Create a context for logged-in player info, players data, and sessions data
const AppContext = createContext(null);

// Custom hook to use app context
const useAppContext = () => useContext(AppContext);

// Main App component
const App = () => {
    const [players, setPlayers] = useState([
        // Initial dummy data for demonstration
        // Each player now has a 'sessionHistory' array
        { id: 'p1', name: 'Alice Smith', playerNumber: '101', isClubAdmin: false, sessionHistory: [
            { sessionId: 's1', wins: 5, games: 10, date: new Date(2024, 6, 1, 18, 0).toISOString() },
            { sessionId: 's2', wins: 7, games: 12, date: new Date(2024, 6, 2, 10, 0).toISOString() },
            { sessionId: 's3', wins: 6, games: 10, date: new Date(2024, 6, 3, 15, 0).toISOString() },
            { sessionId: 's4', wins: 8, games: 15, date: new Date(2024, 6, 4, 20, 0).toISOString() } // More than 3 sessions for testing rolling average
        ]},
        { id: 'p2', name: 'Bob Johnson', playerNumber: '102', isClubAdmin: false, sessionHistory: [
            { sessionId: 's1', wins: 3, games: 10, date: new Date(2024, 6, 1, 18, 0).toISOString() },
            { sessionId: 's2', wins: 5, games: 10, date: new Date(2024, 6, 2, 10, 0).toISOString() }
        ]},
        { id: 'p3', name: 'Charlie Brown', playerNumber: '103', isClubAdmin: false, sessionHistory: [
            { sessionId: 's1', wins: 10, games: 12, date: new Date(2024, 6, 1, 18, 0).toISOString() }
        ]},
        // Ensure the initial admin user also has isClubAdmin: true
        { id: 'p4', name: 'Admin User', playerNumber: '015', isClubAdmin: true, sessionHistory: [
            { sessionId: 's1', wins: 5, games: 10, date: new Date(2024, 6, 1, 18, 0).toISOString() },
            { sessionId: 's2', wins: 3, games: 5, date: new Date(2024, 6, 2, 10, 0).toISOString() }
        ]},
        { id: 'p5', name: 'Newbie Player', playerNumber: '104', isClubAdmin: false, sessionHistory: [] }, // Player with 0 games
        { id: 'p6', name: 'Charvi Patel', playerNumber: '283', isClubAdmin: false, sessionHistory: [] }, // Added Charvi Patel
    ]);
    const [sessions, setSessions] = useState([
        // Initial dummy sessions for demonstration
        { id: 's1', name: 'July 1st Evening Session', date: new Date(2024, 6, 1, 18, 0).toISOString() },
        { id: 's2', name: 'July 2nd Morning Session', date: new Date(2024, 6, 2, 10, 0).toISOString() },
        { id: 's3', name: 'July 3rd Afternoon Session', date: new Date(2024, 6, 3, 15, 0).toISOString() },
        { id: 's4', name: 'July 4th Late Session', date: new Date(2024, 6, 4, 20, 0).toISOString() },
    ].sort((a, b) => new Date(b.date) - new Date(a.date))); // Sort by date descending
    const [loggedInPlayer, setLoggedInPlayer] = useState(null); // Stores the full player object if logged in
    const [error, setError] = useState(null);

    // Function to handle player logout
    const handleLogout = () => {
        setLoggedInPlayer(null);
        setError(null); // Clear any previous errors on logout
    };

    // Derived state for admin status
    // Now directly uses the isClubAdmin flag from the loggedInPlayer object
    const isAdmin = loggedInPlayer && loggedInPlayer.isClubAdmin;

    return (
        <AppContext.Provider value={{ players, setPlayers, sessions, setSessions, loggedInPlayer, setLoggedInPlayer, isAdmin }}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 font-sans text-gray-800">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
                        SLP Badminton Club
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600">
                        Track player profiles and session wins!
                    </p>
                    {/* Player Login/Status Display */}
                    {loggedInPlayer ? (
                        <div className="text-sm text-gray-500 mt-2 flex items-center justify-center flex-wrap">
                            Logged in as: <span className="font-semibold ml-1 mr-2 text-gray-700">{loggedInPlayer.name} (Player #{loggedInPlayer.playerNumber})</span>
                            {isAdmin && (
                                <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm mr-2">
                                    Admin Mode
                                </span>
                            )}
                            <button
                                onClick={handleLogout}
                                className="ml-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-3 rounded-md shadow-sm transition duration-300 ease-in-out mt-2 sm:mt-0"
                            >
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <PlayerLogin />
                    )}
                    {error && (
                        <p className="text-sm text-red-600 mt-2">{error}</p>
                    )}
                </header>

                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Admin Sections */}
                    {isAdmin ? (
                        <>
                            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-200">Add New Player</h2>
                                <AddPlayerForm />
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-200">Create New Session</h2>
                                <CreateSessionForm />
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-200">Remove Existing Session</h2>
                                <RemoveSessionForm />
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-200">Remove Existing Player</h2>
                                <RemovePlayerForm />
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:col-span-2 border border-gray-100"> {/* New Shortlist Section */}
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-200">Create Session Shortlist</h2>
                                <CreateShortlistForm />
                            </div>
                        </>
                    ) : (
                        <div className="lg:col-span-2 bg-yellow-50 border border-yellow-200 rounded-xl shadow-lg p-6 sm:p-8 text-center text-yellow-800">
                            <p className="text-lg font-semibold">
                                Only administrators can add new players, create, or remove sessions/players, or create shortlists.
                            </p>
                            <p className="mt-2 text-sm">
                                {loggedInPlayer ? "You do not have admin access." : "Please log in as an administrator to access these features."}
                            </p>
                        </div>
                    )}

                    {/* Record Wins Section (Accessible by all logged-in users) */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-200">Record Session Wins</h2>
                        {loggedInPlayer ? (
                            <RecordWinsForm />
                        ) : (
                            <div className="text-center text-gray-600">
                                <p className="text-lg font-semibold">Please log in to record session wins.</p>
                            </div>
                        )}
                    </div>

                    {/* Player List Section (always visible) */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-200">Player Leaderboard</h2>
                        <PlayerList />
                    </div>
                </div>
            </div>
        </AppContext.Provider>
    );
};

// Component for player login
const PlayerLogin = () => {
    const { players, setLoggedInPlayer } = useAppContext();
    const [playerNumberInput, setPlayerNumberInput] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (!playerNumberInput.trim()) {
            setMessage('Please enter your player number.');
            setMessageType('error');
            return;
        }

        const foundPlayer = players.find(
            player => player.playerNumber === playerNumberInput.trim()
        );

        if (foundPlayer) {
            // Directly use the isClubAdmin property from the found player object
            setLoggedInPlayer({ ...foundPlayer });
            setMessage('Login successful!');
            setMessageType('success');
            setPlayerNumberInput('');
        } else {
            setMessage('Player number not found. Please try again or contact an admin.');
            setMessageType('error');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <form onSubmit={handleLogin} className="mt-4 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
            <input
                type="text"
                value={playerNumberInput}
                onChange={(e) => setPlayerNumberInput(e.target.value)}
                placeholder="Enter your player number"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-full sm:w-auto text-gray-700"
                required
            />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
            >
                Log In
            </button>
            {message && (
                <p className={`mt-3 text-center text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'} w-full`}>
                    {message}
                </p>
            )}
        </form>
    );
};


// Component to add new players (Admin Only)
const AddPlayerForm = () => {
    const { players, setPlayers } = useAppContext();
    const [playerName, setPlayerName] = useState('');
    const [playerNumber, setPlayerNumber] = useState('');
    const [isClubAdmin, setIsClubAdmin] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleAddPlayer = (e) => {
        e.preventDefault();
        if (!playerName.trim() || !playerNumber.trim()) {
            setMessage('Player name and number cannot be empty.');
            setMessageType('error');
            return;
        }

        // Check if player number already exists in current state
        const playerNumberExists = players.some(
            player => player.playerNumber === playerNumber.trim()
        );

        if (playerNumberExists) {
            setMessage('Player number already exists. Please choose a different one.');
            setMessageType('error');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        const newPlayer = {
            id: `p${players.length + 1}`, // Simple unique ID
            name: playerName.trim(),
            playerNumber: playerNumber.trim(),
            sessionHistory: [], // Initialize with empty session history
            isClubAdmin: isClubAdmin,
        };

        setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
        setMessage('Player added successfully!');
        setMessageType('success');
        setPlayerName(''); // Clear input
        setPlayerNumber('');
        setIsClubAdmin(false);

        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    };

    return (
        <form onSubmit={handleAddPlayer} className="space-y-4">
            <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Player Name
                </label>
                <input
                    type="text"
                    id="playerName"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter player's name"
                    required
                />
            </div>
            <div>
                <label htmlFor="playerNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Player Number
                </label>
                <input
                    type="text"
                    id="playerNumber"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                    value={playerNumber}
                    onChange={(e) => setPlayerNumber(e.target.value)}
                    placeholder="e.g., 001, 123"
                    required
                />
            </div>
            <div className="flex items-center">
                <input
                    id="isClubAdmin"
                    name="isClubAdmin"
                    type="checkbox"
                    checked={isClubAdmin}
                    onChange={(e) => setIsClubAdmin(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isClubAdmin" className="ml-2 block text-sm text-gray-900">
                    Grant Admin Access
                </label>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Add Player
            </button>
            {message && (
                <p className={`mt-3 text-center text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
        </form>
    );
};

// Component to create new sessions (Admin Only)
const CreateSessionForm = () => {
    const { sessions, setSessions } = useAppContext();
    const [sessionName, setSessionName] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleCreateSession = (e) => {
        e.preventDefault();
        if (!sessionName.trim()) {
            setMessage('Session name cannot be empty.');
            setMessageType('error');
            return;
        }

        // Generate a unique ID for the session (e.g., timestamp based)
        const newSessionId = `s${Date.now()}`;
        const newSession = {
            id: newSessionId,
            name: sessionName.trim(),
            date: new Date().toISOString(), // Store current date/time for sorting
        };

        setSessions(prevSessions => {
            const updatedSessions = [...prevSessions, newSession];
            // Sort sessions by date descending (most recent first)
            return updatedSessions.sort((a, b) => new Date(b.date) - new Date(a.date));
        });

        setMessage('Session created successfully!');
        setMessageType('success');
        setSessionName('');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <form onSubmit={handleCreateSession} className="space-y-4">
            <div>
                <label htmlFor="sessionName" className="block text-sm font-medium text-gray-700 mb-1">
                    Session Name
                </label>
                <input
                    type="text"
                    id="sessionName"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="e.g., July 5th Evening"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
                Create Session
            </button>
            {message && (
                <p className={`mt-3 text-center text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
        </form>
    );
};

// Component to remove existing sessions (Admin Only)
const RemoveSessionForm = () => {
    const { players, setPlayers, sessions, setSessions } = useAppContext();
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleRemoveSession = (e) => {
        e.preventDefault();
        if (!selectedSessionId) {
            setMessage('Please select a session to remove.');
            setMessageType('error');
            return;
        }

        // Remove the session from the sessions list
        setSessions(prevSessions => prevSessions.filter(
            session => session.id !== selectedSessionId
        ));

        // Remove session history entries for all players that match the removed session ID
        setPlayers(prevPlayers => prevPlayers.map(player => ({
            ...player,
            sessionHistory: player.sessionHistory.filter(
                entry => entry.sessionId !== selectedSessionId
            )
        })));

        setMessage('Session removed successfully!');
        setMessageType('success');
        setSelectedSessionId(''); // Clear selection
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <form onSubmit={handleRemoveSession} className="space-y-4">
            <div>
                <label htmlFor="selectSessionToRemove" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Session to Remove
                </label>
                <select
                    id="selectSessionToRemove"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    required
                >
                    <option value="">-- Select a Session --</option>
                    {sessions.map((session) => (
                        <option key={session.id} value={session.id}>
                            {session.name} ({new Date(session.date).toLocaleDateString()})
                        </option>
                    ))}
                </select>
            </div>
            <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
                Remove Session
            </button>
            {message && (
                <p className={`mt-3 text-center text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
        </form>
    );
};

// Component to remove existing players (Admin Only)
const RemovePlayerForm = () => {
    const { players, setPlayers, loggedInPlayer, setLoggedInPlayer } = useAppContext();
    const [selectedPlayerId, setSelectedPlayerId] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleRemovePlayer = (e) => {
        e.preventDefault();
        if (!selectedPlayerId) {
            setMessage('Please select a player to remove.');
            setMessageType('error');
            return;
        }

        // Prevent admin from removing themselves
        if (loggedInPlayer && loggedInPlayer.id === selectedPlayerId) {
            setMessage('You cannot remove yourself while logged in.');
            setMessageType('error');
            return;
        }

        // Filter out the selected player
        setPlayers(prevPlayers => prevPlayers.filter(
            player => player.id !== selectedPlayerId
        ));

        setMessage('Player removed successfully!');
        setMessageType('success');
        setSelectedPlayerId(''); // Clear selection
        setTimeout(() => setMessage(''), 3000);
    };

    // Filter out the currently logged-in player from the dropdown options
    const playersForRemoval = players.filter(player => loggedInPlayer ? player.id !== loggedInPlayer.id : true);

    return (
        <form onSubmit={handleRemovePlayer} className="space-y-4">
            <div>
                <label htmlFor="selectPlayerToRemove" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Player to Remove
                </label>
                <select
                    id="selectPlayerToRemove"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                    value={selectedPlayerId}
                    onChange={(e) => setSelectedPlayerId(e.target.value)}
                    required
                >
                    <option value="">-- Select a Player --</option>
                    {playersForRemoval.map((player) => (
                        <option key={player.id} value={player.id}>
                            {player.name} (Player #{player.playerNumber})
                        </option>
                    ))}
                </select>
            </div>
            <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
                Remove Player
            </button>
            {message && (
                <p className={`mt-3 text-center text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
        </form>
    );
};

// Component to create a session shortlist (Admin Only)
const CreateShortlistForm = () => {
    const { players, sessions } = useAppContext();
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [selectedPlayerIds, setSelectedPlayerIds] = useState([]); // Array to store selected player IDs
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Function to calculate rolling stats for a given player
    const getPlayerStats = (player) => {
        const sortedSessionHistory = [...player.sessionHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
        const lastThreeSessions = sortedSessionHistory.slice(0, 3);
        const totalWinsLastThree = lastThreeSessions.reduce((sum, session) => sum + session.wins, 0);
        const totalGamesLastThree = lastThreeSessions.reduce((sum, session) => sum + session.games, 0);
        const winPercentageLastThree = totalGamesLastThree > 0
            ? ((totalWinsLastThree / totalGamesLastThree) * 100).toFixed(2)
            : 'N/A';
        return { totalWinsLastThree, totalGamesLastThree, winPercentageLastThree };
    };

    // Filter and sort players for the shortlist display
    const shortlistedPlayers = players
        .filter(player => selectedPlayerIds.includes(player.id))
        .map(player => ({ ...player, ...getPlayerStats(player) }))
        .sort((a, b) => {
            const aWinPct = parseFloat(a.winPercentageLastThree);
            const bWinPct = parseFloat(b.winPercentageLastThree);

            if (isNaN(aWinPct) && isNaN(bWinPct)) return 0;
            if (isNaN(aWinPct)) return 1;
            if (isNaN(bWinPct)) return -1;

            if (aWinPct !== bWinPct) {
                return bWinPct - aWinPct;
            }
            if (a.totalWinsLastThree !== b.totalWinsLastThree) {
                return b.totalWinsLastThree - a.totalWinsLastThree;
            }
            return a.name.localeCompare(b.name);
        });

    const handlePlayerSelectionChange = (e) => {
        const options = Array.from(e.target.options);
        const selectedValues = options.filter(option => option.selected).map(option => option.value);
        setSelectedPlayerIds(selectedValues);
    };

    return (
        // Changed outer <form> to <div> to fix tag mismatch error
        <div className="space-y-4">
            <div>
                <label htmlFor="selectSessionForShortlist" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Session for Shortlist
                </label>
                <select
                    id="selectSessionForShortlist"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    required
                >
                    <option value="">-- Select a Session --</option>
                    {sessions.map((session) => (
                        <option key={session.id} value={session.id}>
                            {session.name} ({new Date(session.date).toLocaleDateString()})
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="selectPlayersForShortlist" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Players (Ctrl/Cmd + Click to select multiple)
                </label>
                <select
                    id="selectPlayersForShortlist"
                    multiple // Enable multi-select
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-48 overflow-y-auto text-gray-700" // Increased height
                    value={selectedPlayerIds}
                    onChange={handlePlayerSelectionChange}
                >
                    {players.sort((a, b) => a.name.localeCompare(b.name)).map((player) => (
                        <option key={player.id} value={player.id}>
                            {player.name} (Player #{player.playerNumber})
                        </option>
                    ))}
                </select>
            </div>

            {shortlistedPlayers.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Shortlisted Players (Ranked by Win %)</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-md">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tl-lg">Rank</th>
                                    <th className="py-2 px-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Player Name</th>
                                    <th className="py-2 px-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Win % (Last 3)</th>
                                    <th className="py-2 px-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tr-lg">Total Wins (Last 3)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shortlistedPlayers.map((player, index) => (
                                    <tr key={player.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 last:border-b-0`}>
                                        <td className="py-2 px-3 text-sm text-gray-800 font-medium">{index + 1}</td>
                                        <td className="py-2 px-3 text-sm text-gray-800">{player.name}</td>
                                        <td className="py-2 px-3 text-sm text-gray-800 font-semibold">
                                            {player.winPercentageLastThree !== 'N/A' ? `${player.winPercentageLastThree}%` : 'N/A'}
                                        </td>
                                        <td className="py-2 px-3 text-sm text-gray-800">{player.totalWinsLastThree}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {message && (
                <p className={`mt-3 text-center text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};


// Component to record session wins (Accessible by all logged-in users)
const RecordWinsForm = () => {
    const { players, setPlayers, loggedInPlayer, sessions } = useAppContext();
    const [selectedPlayerId, setSelectedPlayerId] = useState(loggedInPlayer ? loggedInPlayer.id : '');
    const [selectedSessionId, setSelectedSessionId] = useState(''); // New state for selected session
    const [sessionWins, setSessionWins] = useState('');
    const [sessionGamesPlayed, setSessionGamesPlayed] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Update selectedPlayerId if loggedInPlayer changes
    useEffect(() => {
        if (loggedInPlayer) {
            setSelectedPlayerId(loggedInPlayer.id);
        } else {
            setSelectedPlayerId('');
        }
    }, [loggedInPlayer]);

    // Effect to populate wins/games when player or session changes
    useEffect(() => {
        if (selectedPlayerId && selectedSessionId) {
            const currentPlayer = players.find(p => p.id === selectedPlayerId);
            if (currentPlayer) {
                const sessionEntry = currentPlayer.sessionHistory.find(
                    entry => entry.sessionId === selectedSessionId
                );
                if (sessionEntry) {
                    setSessionWins(sessionEntry.wins.toString());
                    setSessionGamesPlayed(sessionEntry.games.toString());
                    setMessage('Editing existing session data.');
                    setMessageType('info'); // Use a different message type for info
                } else {
                    // Clear inputs if no existing entry for this session
                    setSessionWins('');
                    setSessionGamesPlayed('');
                    setMessage(''); // Clear info message
                }
            }
        } else {
            // Clear inputs if no player or session is selected
            setSessionWins('');
            setSessionGamesPlayed('');
            setMessage(''); // Clear info message
        }
    }, [selectedPlayerId, selectedSessionId, players]); // Depend on players to re-run if history changes

    // Sort players for the dropdown
    const sortedPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name));

    const handleRecordWins = (e) => {
        e.preventDefault();
        if (!selectedPlayerId || !selectedSessionId || !sessionWins || isNaN(parseInt(sessionWins)) || parseInt(sessionWins) < 0 ||
            !sessionGamesPlayed || isNaN(parseInt(sessionGamesPlayed)) || parseInt(sessionGamesPlayed) < 0) {
            setMessage('Please select a player and session, and enter valid numbers for wins and games played.');
            setMessageType('error');
            return;
        }

        const winsToRecord = parseInt(sessionWins);
        const gamesPlayedToRecord = parseInt(sessionGamesPlayed);

        if (winsToRecord > gamesPlayedToRecord) {
            setMessage('Wins cannot be greater than games played.');
            setMessageType('error');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        setPlayers(prevPlayers => prevPlayers.map(player => {
            if (player.id === selectedPlayerId) {
                const existingSessionIndex = player.sessionHistory.findIndex(
                    entry => entry.sessionId === selectedSessionId
                );
                const sessionDate = sessions.find(s => s.id === selectedSessionId)?.date || new Date().toISOString();

                if (existingSessionIndex > -1) {
                    // Update existing entry
                    const updatedSessionHistory = [...player.sessionHistory];
                    updatedSessionHistory[existingSessionIndex] = {
                        sessionId: selectedSessionId,
                        wins: winsToRecord,
                        games: gamesPlayedToRecord,
                        date: sessionDate
                    };
                    return { ...player, sessionHistory: updatedSessionHistory };
                } else {
                    // Add new entry
                    return {
                        ...player,
                        sessionHistory: [...player.sessionHistory, {
                            sessionId: selectedSessionId,
                            wins: winsToRecord,
                            games: gamesPlayedToRecord,
                            date: sessionDate
                        }]
                    };
                }
            }
            return player;
        }));

        const currentSessionName = sessions.find(s => s.id === selectedSessionId)?.name || 'selected session';
        setMessage(`Successfully recorded/updated data for ${currentSessionName}!`);
        setMessageType('success');
        setSelectedPlayerId(loggedInPlayer ? loggedInPlayer.id : ''); // Reset to logged-in player or empty
        setSelectedSessionId(''); // Clear selected session
        setSessionWins('');
        setSessionGamesPlayed('');

        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <form onSubmit={handleRecordWins} className="space-y-4">
            <div>
                <label htmlFor="selectPlayer" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Player
                </label>
                <select
                    id="selectPlayer"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                    value={selectedPlayerId}
                    onChange={(e) => setSelectedPlayerId(e.target.value)}
                    required
                    // Disable dropdown if a player is logged in and they are not an admin
                    disabled={loggedInPlayer && !loggedInPlayer.isClubAdmin}
                >
                    {loggedInPlayer && !loggedInPlayer.isClubAdmin ? (
                        <option key={loggedInPlayer.id} value={loggedInPlayer.id}>
                            {loggedInPlayer.name} (Player #{loggedInPlayer.playerNumber})
                        </option>
                    ) : (
                        <>
                            <option value="">-- Select a Player --</option>
                            {sortedPlayers.map((player) => (
                                <option key={player.id} value={player.id}>
                                    {player.name} (Player #{player.playerNumber})
                                </option>
                            ))}
                        </>
                    )}
                </select>
            </div>
            <div>
                <label htmlFor="selectSession" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Session
                </label>
                <select
                    id="selectSession"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    required
                >
                    <option value="">-- Select a Session --</option>
                    {sessions.map((session) => (
                        <option key={session.id} value={session.id}>
                            {session.name} ({new Date(session.date).toLocaleDateString()})
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="sessionGamesPlayed" className="block text-sm font-medium text-gray-700 mb-1">
                    Games Played in this Session
                </label>
                <input
                    type="number"
                    id="sessionGamesPlayed"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                    value={sessionGamesPlayed}
                    onChange={(e) => setSessionGamesPlayed(e.target.value)}
                    min="0"
                    placeholder="e.g., 10"
                    required
                />
            </div>
            <div>
                <label htmlFor="sessionWins" className="block text-sm font-medium text-gray-700 mb-1">
                    Wins in this Session
                </label>
                <input
                    type="number"
                    id="sessionWins"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                    value={sessionWins}
                    onChange={(e) => setSessionWins(e.target.value)}
                    min="0"
                    placeholder="e.g., 5"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Record/Update Wins
            </button>
            {message && (
                <p className={`mt-3 text-center text-sm ${messageType === 'success' ? 'text-green-600' : (messageType === 'error' ? 'text-red-600' : 'text-blue-600')}`}>
                    {message}
                </p>
            )}
        </form>
    );
};

// Component to display the player list (leaderboard)
const PlayerList = () => {
    const { players, isAdmin } = useAppContext(); // Get isAdmin from context
    const [error, setError] = useState(null); // Keep error state for potential future use

    // Calculate rolling stats and sort players
    const playersWithCalculatedStats = players.map(player => {
        // Sort session history by date descending (most recent first)
        const sortedSessionHistory = [...player.sessionHistory].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Get the last 3 sessions
        const lastThreeSessions = sortedSessionHistory.slice(0, 3);

        const totalWinsLastThree = lastThreeSessions.reduce((sum, session) => sum + session.wins, 0);
        const totalGamesLastThree = lastThreeSessions.reduce((sum, session) => sum + session.games, 0);

        const winPercentageLastThree = totalGamesLastThree > 0
            ? ((totalWinsLastThree / totalGamesLastThree) * 100).toFixed(2)
            : 'N/A';

        return {
            ...player,
            totalWinsLastThree,
            totalGamesLastThree,
            winPercentageLastThree,
        };
    });

    // Sort players for the leaderboard display
    const sortedPlayers = [...playersWithCalculatedStats].sort((a, b) => {
        // Primary sort by win percentage (descending) - handle 'N/A'
        const aWinPct = parseFloat(a.winPercentageLastThree);
        const bWinPct = parseFloat(b.winPercentageLastThree);

        if (isNaN(aWinPct) && isNaN(bWinPct)) return 0; // Both N/A, keep original order
        if (isNaN(aWinPct)) return 1; // a is N/A, b comes first (N/A comes last)
        if (isNaN(bWinPct)) return -1; // b is N/A, a comes first (N/A comes last)

        if (aWinPct !== bWinPct) {
            return bWinPct - aWinPct;
        }
        // Secondary sort by total wins (descending)
        if (a.totalWinsLastThree !== b.totalWinsLastThree) {
            return b.totalWinsLastThree - a.totalWinsLastThree;
        }
        // Tertiary sort by name (ascending)
        return a.name.localeCompare(b.name);
    });


    if (error) {
        return <p className="text-center text-red-600">{error}</p>;
    }

    if (players.length === 0) {
        return <p className="text-center text-gray-600">No players registered yet. Add some above!</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-tl-lg">Rank</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Player Name</th>
                        {isAdmin && ( // Conditionally render Player Number column header
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Player Number</th>
                        )}
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Total Wins (Last 3)</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Total Games (Last 3)</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-tr-lg">Win % (Last 3)</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPlayers.map((player, index) => {
                        return (
                            <tr key={player.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 last:border-b-0`}>
                                <td className="py-3 px-4 text-sm text-gray-800 font-medium">{index + 1}</td>
                                <td className="py-3 px-4 text-sm text-gray-800">{player.name} {player.isClubAdmin && <span className="text-xs text-blue-500">(Admin)</span>}</td>
                                {isAdmin && ( // Conditionally render Player Number data cell
                                    <td className="py-3 px-4 text-sm text-gray-800">{player.playerNumber}</td>
                                )}
                                <td className="py-3 px-4 text-sm text-gray-800 font-semibold">{player.totalWinsLastThree}</td>
                                <td className="py-3 px-4 text-sm text-gray-800">{player.totalGamesLastThree}</td>
                                <td className="py-3 px-4 text-sm text-gray-800 font-semibold">
                                    {player.winPercentageLastThree !== 'N/A' ? `${player.winPercentageLastThree}%` : 'N/A'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default App;