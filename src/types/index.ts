export type Car = {
	id: string;
	name: string;
	number: string;
	who_take: null | string;
	taked_At: null | number;
};

export type AfkUserInfo = {
	reason: string;
	location: string;
	time: string;
	until: 1771765200000;
};

export type InactiveUserInfo = {
	reason: string;
	date: string;
};
