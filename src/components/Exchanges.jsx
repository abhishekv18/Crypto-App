import React, { useEffect,useState,input } from 'react'
import axios from "axios"
import {server} from "../index";
import { Container, HStack ,VStack,Image,Heading,Text, Center ,Input,Stack,Button,InputGroup,InputRightElement} from '@chakra-ui/react';
import Loader from './Loader';
import Footer from "./Footer";
import './Exchanges.css'
import ErrorComponent from './ErrorComponent';
const Exchanges = () => {
    const[input,setInput]=useState('');
    const [exchanges,setExchanges]= useState([]);
    const [loading,setLoading]= useState(true);
    const [error,setError]=useState(false);

    const inputHandler=(event)=>{
      setInput(event.target.value);
  }
  const searchHandler= async (event)=>{
    event.preventDefault();
    const exc= await exchanges.filter((i)=>{
     return i.name.toLowerCase().includes(input.toLowerCase())
    })
    setExchanges(exc)
  }


    useEffect(()=>{
       const fetchExchanges=async()=>{
        try {
            const {data} =await axios.get(`${server}/exchanges`);
            setExchanges(data);
            setLoading(false); 
        } catch (error) {
            setError(true);
    setLoading(false);  
        }
     
       }
       fetchExchanges();
    },[]);
   

  return( <Container maxW={"Container.xl"}>
    {loading? <Loader/> : <>
    <div className='hero'>
 <form onSubmit={searchHandler}>
    <input onChange={inputHandler} type="text" placeholder='Serach Exchanges..' required value={input}/>
    <button type='submit'>Search</button>
 </form>
    </div>

    <HStack wrap={"wrap"} justifyContent={"space-evenly"}>

        {exchanges.map((i)=>(
           <ExchangeCard name={i.name} img={i.image} rank={i.trust_score_rank} url={i.url} key={i.id} />
        ))}

    </HStack>
    
    </>}
    <Footer/>
  </Container>
  
  );
  
};

 const ExchangeCard = ({name,img,rank,url})=>(
   <a href={url} target={"blank"}>
    <VStack w={"52 "} p={"8"} shadow={"lg"} borderRadius={"lg"} transition={"all 0.3s"} m={"4"}  
    alignItems={"center"} justifyContent={"center"}  display={"flex"} marginLeft={"10"}css={{
        "&:hover":{
            transform:"scale(1.1)"
        }
    }}>
     <Image 
       src={img} 
       w={"10"}
       h={"10"}
     objectFit={"contain"}
    />
       
     
     <Heading size={"md"} noOfLines={1}>{rank}</Heading>
     <Text noOfLines={1}>{name}</Text>
   
    </VStack>
  
   </a>
    
 )
 
export default Exchanges;
