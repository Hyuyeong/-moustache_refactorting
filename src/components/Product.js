import { useState, useEffect } from 'react';
import './Product.scss';

const Product = props => {
  const [getData, setGetData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();

  const [sizeValue, setsizeValue] = useState('');
  const [addToCart, setAddToCart] = useState([]);

  const [cart, setCart] = useState(false);

  const cartHandler = e => {
    setCart(prev => !prev);

    if (addToCart.length === 0) {
      alert('Cart is empty.');
    }
  };

  const addToCartHandler = e => {
    if (!sizeValue) {
      alert('Please select the size');
    }

    if (sizeValue) {
      setAddToCart([...addToCart, sizeValue]);
    }
  };

  console.log(addToCart);

  const API_URL =
    'https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product';
  const getAPI = async function () {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const data = await response.json();
    setGetData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getAPI().catch(error => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  if (isLoading) {
    return <p className="loading">Loading...</p>;
  }

  if (httpError) {
    return <p className="error">{httpError}</p>;
  }

  console.log(getData);

  const { id, title, description, price, imageURL, sizeOptions } = getData;

  const sizeCheckHandler = e => {
    setsizeValue(e.target.value);
  };

  console.log(sizeValue);

  const size = sizeOptions.map(size => (
    <button onClick={sizeCheckHandler} key={size.id} value={size.label}>
      {size.label}
    </button>
  ));

  const sizeChecker = function (sizeCheck) {
    return addToCart.filter(size => size === sizeCheck);
  };

  const defineSize = sizeOptions.map(size => (
    <div>
      {sizeChecker(size.label).length > 0 ? (
        <div className="cart__detail">
          <img className="cart__img" src={imageURL} alt="" />
          <div className="cart__description ">
            <div className="cart__title"> {title}</div>

            <div className="cart__quantity">
              {sizeChecker(size.label).length} x
              <span> ${price.toFixed(2)}</span>
            </div>
            <div className="size">Size : {size.label}</div>
          </div>
        </div>
      ) : null}
    </div>
  ));

  return (
    <div>
      <header className="header">
        <button onClick={cartHandler} className="btn__cart">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          <span>My Cart</span>({addToCart.length})
        </button>

        {cart && addToCart.length > 0 ? (
          <div className="cart">{defineSize} </div>
        ) : null}
      </header>

      <section className="container">
        <img className="product__img" src={imageURL} alt="" />

        <div className="product__detail">
          <div className="product__title">{title}</div>
          <div className="product__price">${price.toFixed(2)}</div>
          <p className="product__description">{description}</p>
          <div className="product__selection">
            size
            <span>*</span> <span className="slected_size">{sizeValue}</span>
          </div>

          <div className="product__size">{size}</div>
          <button onClick={addToCartHandler} className="product__button">
            Add to Cart
          </button>
        </div>
      </section>
    </div>
  );
};
export default Product;
