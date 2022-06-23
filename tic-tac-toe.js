const Player = (sign, sentient) => {
    let _sign = sign;
    let _sentient = sentient;
    const getSign = () => _sign;
    const getSentient = () => _sentient;
    const setSign = (sign, sentient = false) => {
        _sign = sign;
        _sentient = sentient;
        const buttons = document.querySelectorAll('button.btn-faction');
        buttons.forEach(button => {
            if (button.value === sign) {
                if (sentient) button.classList.add('selected');
                else button.classList.remove('selected');
            }
        });
    }
    return {
        getSign,
        getSentient,
        setSign
    }
}

const switchFaction = (sign) => {
    if (sign === 'X') _humanPlayer.setSign('X', true), _aiPlayer.setSign('O');
    else if (sign === 'O') _humanPlayer.setSign('O', true), _aiPlayer.setSign('X');
    else throw 'Incorrect sign';
}

const _humanPlayer = Player('X');
const _aiPlayer = Player('O');