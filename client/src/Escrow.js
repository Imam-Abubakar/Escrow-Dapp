import { ethers } from 'ethers';

export default function Escrow({ address, moderator, receipient, value, handleApprove }) {
	return (
		<div className='existing-contract'>
			<ul className='fields'>
				<li>
					<div> Moderator </div>
					<div> {moderator} </div>
				</li>
				<li>
					<div> Receipient </div>
					<div> {receipient} </div>
				</li>
				<li>
					<div> Value </div>
					<div> {ethers.utils.formatEther(value)} </div>
				</li>
				<div
					className='approve_btn'
					id={address}
					onClick={(e) => {
						e.preventDefault();

						handleApprove();
					}}
				>
					Approve
				</div>
			</ul>
		</div>
	);
}
