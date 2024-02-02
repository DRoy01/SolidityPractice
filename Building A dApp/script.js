// Define the Ethereum smart contract address for the MoodContract
const MoodContractAddress = "0x21127f7a4c0A6dC97215C4e52F90Fec883aC59D5";

// Define the ABI (Application Binary Interface) for the MoodContract, specifying its functions and their details
const MoodContractABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_mood",
        "type": "string"
      }
    ],
    "name": "setMood",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMood",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Initialize variables to store the instance of the MoodContract and the Ethereum account signer
let MoodContract = undefined;
let signer = undefined;

// Function to enable or disable the Get Mood and Set Mood buttons based on wallet connection status
function updateButtonStatus(connected) {
  document.getElementById('getMoodButton').disabled = !connected;
  document.getElementById('setMoodButton').disabled = !connected;
}

// Create a Web3Provider using the Ethereum provider from the browser, specifying a custom network name "sepolia"
const provider = new ethers.providers.Web3Provider(window.ethereum, "sepolia");

// Function to connect the wallet
async function connectWallet() {
  try {
    // Prompt user to connect their MetaMask wallet
    await ethereum.request({ method: 'eth_requestAccounts' });

    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      // Retrieve the list of Ethereum accounts after successful account request
      const accounts = await provider.listAccounts();

      // Get the signer object for the first Ethereum account
      signer = provider.getSigner(accounts[0]);

      // Instantiate the MoodContract with the contract address, ABI, and signer
      MoodContract = new ethers.Contract(
        MoodContractAddress,
        MoodContractABI,
        signer
      );

      // Enable the Get Mood and Set Mood buttons
      updateButtonStatus(true);

      // Display success message on the frontend
      displaySuccessMessage("Wallet Connected Successfully!");

      // Now that the wallet is connected, you can perform further initialization or actions
      console.log('Wallet connected successfully!');
    } else {
      throw new Error('MetaMask is not installed.');
    }
  } catch (error) {
    // Handle error
    console.error('Error connecting wallet:', error.message);

    // Display error message on the frontend
    displayErrorMessage("Metamask Wallet Not Found!");

    // Disable the Get Mood and Set Mood buttons if wallet connection fails
    updateButtonStatus(false);
  }
}

// Event listener for the Connect Wallet button
document.getElementById('connectWalletButton').addEventListener('click', connectWallet);

// ... (rest of your script)

// Event listener for the Get Mood button
document.getElementById('getMoodButton').addEventListener('click', getMood);
document.getElementById('setMoodButton').addEventListener('click', setMood);

// Asynchronous function to fetch and display the current mood
async function getMood() {
  // Call the getMood function from the MoodContract
  const mood = await MoodContract.getMood();

  // Display the fetched mood on the webpage
  document.getElementById("showMood").innerText = `Your Mood: ${mood}`;

  // Log the mood to the console for debugging or further analysis
  console.log(mood);
}

// Asynchronous function to set a new mood
async function setMood() {
  // Get the mood value from the input field on the webpage
  const mood = document.getElementById("mood").value;

  // Call the setMood function of the MoodContract to update the stored mood value
  await MoodContract.setMood(mood);
}

// Function to display success message on the frontend
function displaySuccessMessage(message) {
  const successMessageContainer = document.getElementById('successMessageContainer');

  if (successMessageContainer) {
    successMessageContainer.innerHTML = `<p style="color: green;">${message}</p>`;
  }
}

// Function to display error message on the frontend
function displayErrorMessage(message) {
  const errorMessageContainer = document.getElementById('errorMessageContainer');

  if (errorMessageContainer) {
    errorMessageContainer.innerHTML = `<p style="color: red;">${message}</p>`;
  }
}
