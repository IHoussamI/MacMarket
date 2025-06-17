package org.example.backendmac.Repositories.Product;

import org.example.backendmac.models.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductRepository extends JpaRepository<Product,Long> {

}
