import "./App.css";
import { useState, useEffect } from "react";
import PokemonCard from "./Components/PokemonCard";
import TextInput from "./Components/TextInput";
import { FetchPokemon, getNextPage } from "./Components/Api";

function App() {
	const [userInput, setUserInput] = useState("");
	const [resultPokemon, setResultPokemon] = useState(undefined);
	const [nextPageData, setNextPageData] = useState(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [nothingFound, setNothingFound] = useState(false);
	const [serverError, setServerError] = useState(false);
	const [retryCount, setRetryCount] = useState(0);

	useEffect(() => {
		setNextPageData(undefined);
		setResultPokemon(undefined);
		setIsLoading(true);

		if (userInput) {
			// setTimeout so user can finish typing
			const search = setTimeout(async () => {
				await fetchPokemon();
			}, 400);

			// setTimeout cleanup
			return () => clearTimeout(search);
		} else {
			setResultPokemon(undefined);
		}
	}, [userInput, retryCount]);

	const fetchPokemon = async () => {
		try {
			const fetchedPokemon = await FetchPokemon(userInput);

			if (fetchedPokemon.nextPage) {
				const page = await getNextPage(fetchedPokemon.nextPage);
				setNextPageData(page);
			}

			if (fetchedPokemon.pokemon.length) {
				setResultPokemon(fetchedPokemon.pokemon);
				setNothingFound(false);
			}

			if (fetchedPokemon.pokemon.length === 0) {
				setNothingFound(true);
			}
		} catch (error) {
			if (retryCount < 3) {
				// Maximum 3 retry attempts
				console.error("Error:", error);
				const retryTimer = setTimeout(() => handleRetry(), 300); //retry
				return () => clearTimeout(retryTimer);
			} else {
				console.error("Maximum retry attempts reached.");
				setServerError(true); // Show server error message after maximum retries
			}
		}

		setIsLoading(false);
	};

	const handleRetry = () => {
		setServerError(false);
		setRetryCount((prevCount) => prevCount + 1);
	};

	const handleServerError = () => {
		setRetryCount(0);
		setServerError(false);
	};

	const showNextPage = async () => {
		setResultPokemon(nextPageData.pokemon);

		if (nextPageData.nextPage) {
			try {
				const updateNextPage = await getNextPage(nextPageData.nextPage);
				setNextPageData(updateNextPage);
			} catch (error) {
				setServerError(true);
				console.error("Error:", error.message);
			}
		}
	};

	return (
		<div className="App">
			{serverError ? (
				<>
					<p>
						Sorry we can't fetch this, something funky happened to the server!
					</p>
					<button onClick={handleServerError}>Ok</button>
				</>
			) : (
				<>
					<label htmlFor="search-pokemon" className="label">
						<b>Search Pokémon!</b>
					</label>
					<TextInput
						className="search"
						placeholder="Search pokemon..."
						value={userInput}
						id="search-pokemon"
						onChange={(event) => setUserInput(event.target.value)}
					/>

					{isLoading ? (
						<div aria-live="polite">
							<p>loading...</p>
						</div>
					) : null}

					{nothingFound ? (
						<p className="error">
							<b>No pokémon found</b>
						</p>
					) : null}
					<div className="grid">
						{resultPokemon
							? resultPokemon.map((pokemon) => (
									<PokemonCard
										key={pokemon.id}
										id={pokemon.id}
										name={pokemon.name}
										classfication={pokemon.classfication}
									/>
							  ))
							: null}
					</div>

					{nextPageData && userInput ? (
						<button
							onClick={showNextPage}
							disabled={!nextPageData.nextPage}
							aria-label="Next page"
						>
							Next page
						</button>
					) : null}
				</>
			)}
		</div>
	);
}

export default App;
