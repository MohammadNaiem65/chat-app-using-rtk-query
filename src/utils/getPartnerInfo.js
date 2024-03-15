export default function getPartnerInfo(participants, loggedInUserEmail) {
	return participants.find(
		(participant) => participant.email !== loggedInUserEmail
	);
}
