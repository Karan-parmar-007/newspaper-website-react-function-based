import React from 'react';
import loading from './loading_mk.gif'; // Import as a named import

const Spinner = () => {
    return (
      <div className='text-center'>
        <img src={loading} alt='loading' />
      </div>
    );
}

export default Spinner;
