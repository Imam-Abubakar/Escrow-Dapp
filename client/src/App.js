import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
	const approveTxn = await escrowContract.connect(signer).approve();
	await approveTxn.wait();
}

function App() {
	const [escrows, setEscrows] = useState([]);
	const [account, setAccount] = useState();
	const [signer, setSigner] = useState();

	useEffect(() => {
		async function getAccounts() {
			const accounts = await provider.send("eth_requestAccounts", []);

			setAccount(accounts[0]);
			setSigner(provider.getSigner());
		}

		getAccounts();
	}, [account]);

	async function newContract() {
		const receipient = document.getElementById("receipient").value;
		const moderator = document.getElementById("moderator").value;
		const value = ethers.utils.parseEther(
			document.getElementById("matic").value
		);
		const escrowContract = await deploy(signer, moderator, receipient, value);

		const escrow = {
			address: escrowContract.address,
			moderator,
			receipient,
			value: value.toString(),
			handleApprove: async () => {
				escrowContract.on("Approved", () => {
					document.getElementById(escrowContract.address).className =
						"complete";
					document.getElementById(escrowContract.address).innerText =
						"Approved!";
				});

				await approve(escrowContract, signer);
			},
		};

		console.log(escrowContract.address);

		setEscrows([...escrows, escrow]);
	}

	return (
		<>
			<div className="header">
				ESCROW DAPP
			</div>
			<div className="contract">
				<h1> New Contract </h1>
				<br />
				<div>
					<label>Moderator Address: {" "}</label>
					<input type="text" id="moderator" />
				</div>

				<div>
					<label>Receipient Address: {" "}</label>
					<input type="text" id="receipient" />
				</div>

				<div>
					<label>Deposit Amount (in MATIC): {" "}</label>
					<input type="text" id="matic" />
				</div>

				<div
					className="button"
					id="deploy"
					onClick={(e) => {
						e.preventDefault();

						newContract();
					}}
				>
					Deploy
				</div>
			</div>

			<div className="existing-contracts">
				<h1> Existing Contracts </h1>

				<div id="container">
					{escrows.map((escrow) => {
						return <Escrow key={escrow.address} {...escrow} />;
					})}
				</div>
			</div>
		</>
	);
}

export default App;
