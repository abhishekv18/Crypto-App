import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"
import {server} from "../index";
import { Container, HStack ,VStack,Image,Heading,Text, Center,Button,Radio,RadioGroup} from '@chakra-ui/react';
import Loader from './Loader';
import Footer from './Footer';
import ErrorComponent from './ErrorComponent';
const Coins = () => {

    const [coins,setCoins]= useState([]);
    const [loading,setLoading]= useState(true);
    const [page,setPage]=useState(1);
    const [error,setError]=useState(false);
    const[input,setInput]=useState('');
    const [currency,setCurrency]=useState("inr");
    const currencySymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";



    const inputHandler=(event)=>{
      setInput(event.target.value);
  }
  const searchHandler= async (event)=>{
    event.preventDefault();
    const exc= await coins.filter((i)=>{
     return i.name.toLowerCase().includes(input.toLowerCase())
    })
    setCoins(exc)
  }


    const changePage=(page)=>{
        setPage(page);
        setLoading(true);

        
    };
    const btns = new Array(132).fill(1);
    useEffect(()=>{
       const fetchCoins=async()=>{
     try {
        const {data} =await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`);
        setCoins(data);
        setLoading(false);
     } catch (error) {
    setError(true);
    setLoading(false);
     }
       }
       fetchCoins();
    },[currency,page]);
  if(error) return <ErrorComponent/>;
  return( <Container maxW={"Container.xl"}>
    {loading? <Loader/> : <>
      <div className='hero'>
 <form onSubmit={searchHandler}>
    <input onChange={inputHandler} type="text" placeholder='Serach Exchanges..' required value={input}/>
    <button type='submit'>Search</button>
 </form>
    </div>
    <RadioGroup value={currency} onChange={setCurrency} p={"9"} >
        <HStack spacing={"4"}>
        <Radio value={"inr"}>INR</Radio>
        <Radio value={"usd"}>USD</Radio>
        <Radio value={"eur"}>EUR</Radio>
        </HStack>
    </RadioGroup>
       <HStack wrap={"wrap"} justifyContent={"space-evenly"}>

        {coins.map((i)=>(
           <CoinCard name={i.name} img={i.image}  id={i.id} price={i.current_price} symbol={i.symbol} currencySymbol={currencySymbol}/>
        ))}

     </HStack>
     <HStack w={"full"} overflow={"auto"}p={8}>
      {
        btns.map((item,index)=>(
            <Button onClick={()=>changePage(index+1)} color={"white"} bgColor={"blackAlpha.900"}>
            {index+1}

            </Button>
        ))
      }
     </HStack>
    </>}
    <Footer/>
  </Container>
  );
  
};//try blank means on same page  rahega
 const CoinCard = ({name,img,id,price,symbol,currencySymbol="₹"})=>(
   <Link to={`/coin/${id}`} >
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
       
     
     <Heading size={"md"} noOfLines={1}>{symbol}</Heading>
     <Text noOfLines={1}>{name}</Text>
     <Text noOfLines={1}>{price? `${currencySymbol}${price}`:"NA"}</Text>
    </VStack>
   </Link>
 )

export default Coins;
