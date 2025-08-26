import {Link} from 'react-router-dom'
const Home = () => {




  return (
    <div>
        <div className='text-2xl font-extrabold'>These</div> is testing
        <ul>
            <li><Link to='/independents'>For independents</Link></li>
            <li><Link to='/clients'>For Clients</Link></li>
            <li><Link to='/hybrid'>For Hybrids</Link></li>
        </ul>
      
    </div>
  )
}

export default Home