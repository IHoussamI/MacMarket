package org.example.backendmac.Services.product;

import lombok.RequiredArgsConstructor;
import org.example.backendmac.DTO.ProductDTO.ProductRequestDTO;
import org.example.backendmac.models.product.Product;
import org.example.backendmac.Repositories.Product.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

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

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    public Product saveProduct(ProductRequestDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setOldprice(dto.getOldprice());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());
        product.setImageUrl(dto.getImageUrl());

        return productRepository.save(product);
    }
    public String saveImage(MultipartFile file) {
        try {
            String uploadsDir = "src/main/resources/static/images/";
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadsDir + fileName);

            // Create directory if not exists
            Files.createDirectories(path.getParent());

            // Save the file
            Files.write(path, file.getBytes());

            return  fileName; // URL to access image
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image", e);
        }
    }



    // Update a product
    public Product updateProduct(Long productId, ProductRequestDTO dto) {
        return productRepository.findById(productId).map(product -> {
            product.setName(dto.getName());
            product.setOldprice(dto.getOldprice());
            product.setPrice(dto.getPrice());
            product.setDescription(dto.getDescription());

            // Only update image if a new one is provided
            if (dto.getImageUrl() != null) {
                product.setImageUrl(dto.getImageUrl());
            }

            return productRepository.save(product);
        }).orElse(null);
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
