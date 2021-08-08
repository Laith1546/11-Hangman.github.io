export const giveRandomNoun = async () => {
    const jsonData = await fetch("https://random-word-form.herokuapp.com/random/noun");
    const data = await jsonData.json();
    console.log(data[0]);
}
