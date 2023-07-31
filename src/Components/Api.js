const url = "https://hungry-woolly-leech.glitch.me";

export const FetchPokemon = async (query) => {
	try {
		const results = await fetch(
			`${url}/api/pokemon/search/${query}?chaos=true`
		);
		const data = await results.json();

		return data;
	} catch (error) {
		throw new Error("An error has occured");
	}
};

export const getNextPage = async (token) => {
	try {
		const results = await fetch(`${url}/api/pokemon?page=${token}`);
		const data = await results.json();

		return data;
	} catch (error) {
		throw new Error("An error has occured");
	}
};
