export type Car = {
	id: string;
	name: string;
	number: string;
	who_take: null | string;
	taked_At: null | number;
	roles: string[];
};

export type AfkUserInfo = {
	reason: string;
	location: string;
	time: string;
	until: number;
};

export type InactiveUserInfo = {
	reason: string;
	date: string;
};

export type StatusRequestInFam = 'new' | 'rejected' | 'accepted' | 'interview';
export type RequestInFam = {
	status: StatusRequestInFam;
	interviewerId: string;

	userId: string;
	age: string;

	nickName: string;
	gameLvl: string;
	gameStatic: string;
	gameFraction: string;

	// Other Info
	gameExpirience: string;
	famExpirience: string;
	whereHearAboutUs: string;
	dmReplayLink: string;
};
