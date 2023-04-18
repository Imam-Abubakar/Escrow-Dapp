import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider('ALCHEMY_KEY_goerli');

export default async function addContract(id, contract, moderator, receipient, value) {
	const buttonId = `approve-${id}`;

	const container = document.getElementById('container');
	container.innerHTML += createHTML(buttonId, moderator, receipient, value);

	contract.on('Approved', () => {
		document.getElementById(buttonId).className = 'complete';
		document.getElementById(buttonId).innerText = "✓ It's been approved!";
	});

	document.getElementById(buttonId).addEventListener('click', async () => {
		const signer = provider.getSigner();
		await contract.connect(signer).approve();
	});
}

function createHTML(buttonId, moderator, receipient, value) {
	return `
    <div class="existing-contract">
      <ul className="fields">
        <li>
          <div> Moderator </div>
          <div> ${moderator} </div>
        </li>
        <li>
          <div> Receipient </div>
          <div> ${receipient} </div>
        </li>
        <li>
          <div> Value </div>
          <div> ${value} </div>
        </li>
        <div class="button" id="${buttonId}">
          Approve
        </div>
      </ul>
    </div>
  `;
}
