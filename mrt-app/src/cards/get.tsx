const getCards = async() => {
    try {
        const response = await fetch('http://localhost:5000/cards/get', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    } catch (error){
        
    }
}

export default getCards;