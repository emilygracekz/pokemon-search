function TextInput({ className, placeholder, value, id, onChange }) {
	return (
		<input
			className={className}
			type="text"
			placeholder={placeholder}
			value={value}
			id={id}
			onChange={onChange}
			autoComplete="off"
		/>
	);
}

export default TextInput;
