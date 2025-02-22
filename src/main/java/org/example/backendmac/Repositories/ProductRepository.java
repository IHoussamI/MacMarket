package org.example.backendmac.Repositories;

import org.example.backendmac.models.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductRepository extends JpaRepository<Product,Long> {

}
