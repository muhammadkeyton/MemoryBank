import React,{useEffect} from "react";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { getAllPosts } from "../Actions/posts";
import { get_All_Posts } from "../features/postsSlice";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { startPostLoading,stopPostLoading } from "../features/postsSlice";

const Paginate = ({page})=>{
    
    const {numberOfPages }= useSelector((state)=>state.posts);

    const dispatch = useDispatch();

    useEffect(()=>{

        const fetchPosts = async ()=>{
            if(page){
                dispatch(startPostLoading())
                const data = await getAllPosts(page);
                dispatch(get_All_Posts(data))
                dispatch(stopPostLoading())
            }
            
        }
            
        fetchPosts()
      
    },[page,dispatch])

    return (
        <Pagination
          count={numberOfPages}
          page={Number(page) || 1}
          variant="outlined"
          color="secondary"
          renderItem={(item) => (
            <PaginationItem {...item} component={Link} to={`/posts?page=${item.page}`} />
          )}
        />
    );
}

export default Paginate;


