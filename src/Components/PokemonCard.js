const PokemonCard = ({ id, name, classfication }) => {

    return (
		<div className="pokemon-card">
			<p><b>Id:</b> {id}</p>
			<p><b>Name:</b> {name}</p>
			<p><b>Classification:</b> {classfication}</p>
		</div>
	);
};

export default PokemonCard;
