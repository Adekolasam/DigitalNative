const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


const DNPink = "DNPink";
const DNGreen = "DNGreen"
const formValidationState = {
    name: false,
    email: false,
    card: false,
    submit: false
};

const validatePrintableChars = (text) => {
    ///[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    var format = /^[\x00-\x7F]+$/; 
    return (format.test(text));
}

const validateCardLength = (PAN) => {
    return (PAN.length >= 16 && PAN.length <= 19) 
}

const nameFieldHandler = () => {
    var nameElement = document.getElementById("name");
    var origName = nameElement.value;
    var unspacedName = origName.replace(/\s+/g, '');


    if(!(unspacedName.length >= 5)){
        nameElement.className = DNPink;
    }
    else if(!validatePrintableChars(origName)){
        nameElement.className = DNPink;
    }
    else {
        nameElement.className = DNGreen;
        formValidationState.name = true;
    }
    
    return;
}

const emailFieldHandler = () => {
    let email = document.getElementById("email");

    if(!validateEmail(email.value)){
        email.className = DNPink;
    }
    else if(!validatePrintableChars(email.value)){
        email.className = DNPink;
    }
    else {
        email.className = DNGreen;
        formValidationState.email = true;
    }

    return;
}

const cardFieldHandler = () => {
    let card = document.getElementById("card");
    cardPAN = card.value.replace(/\s+/g, '');
    cardPAN = cardPAN.replace("-", '');

    //card.value = cardPAN; //could replace all spaces with hyphen, or split into 4 sections:  for uniformity
    
    if(!validatePrintableChars(cardPAN)){
        card.className = DNPink;
    }
    else if(!validateWithLuhnAlg(cardPAN)){
        card.className = DNPink;
    }
    else {
        card.className = DNGreen;
        formValidationState.card = true;
    }

    return
}

const validateWithLuhnAlg = num => {
    if (!num || num == 0) return false;
    else if (/[^0-9-\s]+/.test(num)) return false;
    
    let arr = (num + '')
      .split('')
      .reverse()
      .map(x => parseInt(x));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
        
    sum += lastDigit;
    return sum % 10 === 0;
};


const validateForm = () => {
    if(!formValidationState.name) {
        alert("Enter a valid name");
        return false;
    }
    else if(!formValidationState.email){
        alert("Enter a valid email address");
        return false;
    } 
    else if (!formValidationState.card) {
        alert("Enter a valid Card Number");
        return false;
    }

    return true;
}


const sendMail = (from, to, subject,msg) => Email.send({
    SecureToken : "apiToken",
    To : to,
    From : from,
    Subject : subject,
    Body : msg
    }).then(
      message => alert(message)
);




const sendMailHandler = () => {

    if(!validateForm) return false;
    
    var msg = "<h1>Form Details</h1>"
            + "<p>Name: " + document.getElementById("name").value + "</p>"
            + "<p>Email: " + document.getElementById("email").value + "</p>"
            + "<p>Card PAN: " + document.getElementById("card").value + "</p>";
    
    sendMail(
        "test@gmail.com",
        "test@dn-uk.com", 
        "Validated Form",
        msg
    );
}