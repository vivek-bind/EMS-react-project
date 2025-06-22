// import React, { Component } from 'react'

// export class NotFound404 extends Component {
//     render() {
//         return (
//             <div style={{ "height": "100%", "width": "100%", "backgroundColor": "white", "marginTop": "200px", "textAlign": "center" }}>

//                 <h1> | Not Found</h1>
//             </div>
//         )
//     }
// }

// export default NotFound404;





////updated code
import React, { Component } from 'react';
import NotFoundImage from '../img/logo.png'; // adjust the path as needed

export class NotFound404 extends Component {
  render() {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'white',
          marginTop: '100px',
          textAlign: 'center',
        }}
      >
        <img
          src={NotFoundImage}
          alt="404 Not Found"
          style={{
            width: '300px', // adjust size
            maxWidth: '90%',
          }}
        />
        {/* Optional caption below the image */}
        <h2 style={{ marginTop: '20px', color: '#888' }}></h2>
      </div>
    );
  }
}

export default NotFound404;

