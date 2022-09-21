import React from 'react'

import Navbar from "../Navbar/Navbar"
import Posts from '../Posts/Posts'
import Form from '../Form/Form'
import Grid from '@mui/material/Grid';








function Home() {
  
  return (
   

    
    <>
        <Navbar />

        

          <Grid container spacing={2}>

            <Grid item xs={12} sm={6} md={7} lg={8} order={{ xs: 2, sm: 1 ,md:1,lg:1}}>
              <Posts  />
            </Grid>

            <Grid item xs={12} sm={6} md={5} lg={4} order={{ xs: 1, sm: 2,md:2,lg:2 }}>
              <Form />
            </Grid>
            
            
          </Grid>

        
        

    </>

    
  )
}

export default Home