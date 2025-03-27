import { useState, useEffect } from 'react';
import './App.css';
import * as MaterialUI from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function App() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', price: '', image: '', _id: '' });
  const [imageOpen, setImageOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleEdit = (product) => {
    if (product && product._id) {
      setCurrentProduct(product);
      setIsEditing(true);
      setOpen(true);
    } else {
      console.error('Product does not have an _id');
    }
  };

  const handleDelete = async (product) => {
    if (!product || !product._id) {
      console.error('Product does not have an _id');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/products/${product._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      setProducts(products.filter(p => p._id !== product._id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value,
    }));
  };

  const updateProduct = async () => {
    if (!currentProduct._id) {
      console.error('Current product does not have an _id');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/products/${currentProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentProduct),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      const data = await response.json();
      setProducts(products.map(p => (p._id === currentProduct._id ? data.product : p)));
      handleClose();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const createProduct = async () => {
    const { _id, ...newProduct } = currentProduct; // Exclude _id from the new product
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      const data = await response.json();
      setProducts([...products, data.product]);
      handleClose();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleSubmit = () => {
    if (isEditing) {
      updateProduct();
    } else {
      createProduct();
    }
  };

  const handleAddProduct = () => {
    setCurrentProduct({ name: '', price: '', image: '', _id: '' });
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProduct({ name: '', price: '', image: '', _id: '' });
  };

  const handleImageClick = (image) => {
    if (image) {
      setImageSrc(image);
      setImageOpen(true);
    }
  };

  const handleImageClose = () => {
    setImageOpen(false);
    setImageSrc('');
  };

  return (
    <>
      <MaterialUI.AppBar position="static">
        <MaterialUI.Toolbar>
          <MaterialUI.Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
            Product Store
          </MaterialUI.Typography>
          <MaterialUI.IconButton color="inherit" onClick={handleAddProduct}>
            <AddIcon />
          </MaterialUI.IconButton>
        </MaterialUI.Toolbar>
      </MaterialUI.AppBar>
      <MaterialUI.Container>
        <MaterialUI.Grid container spacing={3} style={{ marginTop: '20px' }}>
          {products && products.length > 0 ? products.map(product => (
            product && product._id ? (
              <MaterialUI.Grid item xs={12} sm={6} md={4} key={product._id}>
                <MaterialUI.Card>
                  <MaterialUI.CardMedia
                    component="img"
                    height="140"
                    image={product.image || null}
                    alt={product.name || 'Product'}
                    onClick={() => product.image && handleImageClick(product.image)}
                  />
                  <MaterialUI.CardContent>
                    <MaterialUI.Typography gutterBottom variant="h5" component="div">
                      {product.name || 'Unnamed Product'}
                    </MaterialUI.Typography>
                    <MaterialUI.Typography variant="body2" color="text.secondary">
                      ${product.price || 0}
                    </MaterialUI.Typography>
                    <MaterialUI.Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={() => handleEdit(product)}>
                      Edit
                    </MaterialUI.Button>
                    <MaterialUI.Button variant="contained" color="secondary" style={{ marginLeft: '10px' }} onClick={() => handleDelete(product)}>
                      Delete
                    </MaterialUI.Button>
                  </MaterialUI.CardContent>
                </MaterialUI.Card>
              </MaterialUI.Grid>
            ) : null
          )) : (
            <MaterialUI.Grid item xs={12}>
              <MaterialUI.Typography variant="h6" align="center">
                No products found
              </MaterialUI.Typography>
            </MaterialUI.Grid>
          )}
        </MaterialUI.Grid>
      </MaterialUI.Container>
      <MaterialUI.Dialog open={open} onClose={handleClose}>
        <MaterialUI.DialogTitle>{isEditing ? 'Edit Product' : 'Add Product'}</MaterialUI.DialogTitle>
        <MaterialUI.DialogContent>
          <MaterialUI.TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={currentProduct.name}
            onChange={handleChange}
          />
          <MaterialUI.TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={currentProduct.price}
            onChange={handleChange}
          />
          <MaterialUI.TextField
            margin="dense"
            name="image"
            label="Image URL"
            type="text"
            fullWidth
            value={currentProduct.image}
            onChange={handleChange}
          />
        </MaterialUI.DialogContent>
        <MaterialUI.DialogActions>
          <MaterialUI.Button onClick={handleClose} color="primary">
            Cancel
          </MaterialUI.Button>
          <MaterialUI.Button onClick={handleSubmit} color="primary">
            {isEditing ? 'Save' : 'Add'}
          </MaterialUI.Button>
        </MaterialUI.DialogActions>
      </MaterialUI.Dialog>
      <MaterialUI.Dialog open={imageOpen} onClose={handleImageClose}>
        <MaterialUI.DialogContent>
          {imageSrc && <img src={imageSrc} alt="Product" style={{ width: '100%' }} />}
        </MaterialUI.DialogContent>
        <MaterialUI.DialogActions>
          <MaterialUI.Button onClick={handleImageClose} color="primary">
            Close
          </MaterialUI.Button>
        </MaterialUI.DialogActions>
      </MaterialUI.Dialog>
    </>
  );
}

export default App;
