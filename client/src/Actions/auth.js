import * as api from "../Api/index";

export const submitSignUpData = async(signUpData,navigate)=>{
    try{
        const {data} = await api.sendSignUpData(signUpData);
        navigate("/posts")
        return data;
    }catch(error){
        return error.response.data.message;
    }
    
}


export const submitLoginData = async(loginData,navigate)=>{
    try{
        const {data} = await api.sendLoginData(loginData)
        navigate("/")
        return data;
    }catch(error){
        return error.response.data.message;
    }
}

export const submitGoogleData = async(googleData,navigate)=>{
    try{
        const {data:{proceed}} = await api.sendGoogleData(googleData)
        navigate("/")
        return proceed;
    }catch(error){
        const {proceed} = error.response.data;
        return proceed;
    }
    
}