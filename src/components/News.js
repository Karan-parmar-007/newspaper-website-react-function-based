import React, {useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {

  const [articals, setArticals] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)



  const capitalixeFirstLetter = (string)=>{
    return string.charAt(0).toUpperCase()+string.slice(1);
  }

  const updateStatus = async () => {
    props.setProgress(10)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pagesize=${props.pageSize}`
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30)
    let parseData = await data.json()
    props.setProgress(70)
    setArticals(parseData.articles)
    setTotalResults(parseData.totalResults)
    setLoading(false)
    props.setProgress(100)
  }

  useEffect(() => {
    document.title = `${capitalixeFirstLetter(props.category)} - NewsMonkey`
    updateStatus()
  }, [])
  

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pagesize=${props.pageSize}`;
    setLoading(true);
    try {
      let data = await fetch(url);
      let parseData = await data.json();
      setArticals(articals.concat(parseData.articles));
      setTotalResults(parseData.totalResults);
      setPage(page + 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  

    return (
      <div className='container my-3'>
      <h1 className="text-center" style={{margin: '35px 0px'}}>NewsMonkey Top Headlines from {capitalixeFirstLetter(props.category)} category</h1>
      <InfiniteScroll
          dataLength={articals.length}
          next={fetchMoreData}
          hasMore={articals.length !== totalResults}
          loader={<Spinner/>}
        >
        <div className="container">
          <div className="row">
            {
              articals.map((element) => (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 40) : ''}
                    description={element.description ? element.description.slice(0, 80) : ''}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    auther={element.author}
                    date={element.publishedAt}
                  />
                </div>
              ))}
          </div>
        </div>
      </InfiniteScroll>  
      </div>
    );  
}


News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: 'general',
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}


export default News