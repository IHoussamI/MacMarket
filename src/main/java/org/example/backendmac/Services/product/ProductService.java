package org.example.backendmac.Services.product;

import lombok.RequiredArgsConstructor;
import org.example.backendmac.models.product.Product;
import org.example.backendmac.Repositories.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService implements iProductService {
    private final ProductRepository productRepository;

    @Override
    public Product getProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
    }

    // Save a new product
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Update a product
    public Product updateProduct(Long productId, Product productDetails) {
        if (productRepository.existsById(productId)) {
            productDetails.setId(productId); // Set the ID for the existing product
            return productRepository.save(productDetails);
        }
        return null;
    }

    // Delete a product
    public boolean deleteProduct(Long productId) {
        if (productRepository.existsById(productId)) {
            productRepository.deleteById(productId);
            return true;
        }
        return false;
    }
}
