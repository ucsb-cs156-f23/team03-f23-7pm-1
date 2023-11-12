package edu.ucsb.cs156.example.repositories;

import org.springframework.beans.propertyeditors.StringArrayPropertyEditor;
import org.springframework.stereotype.Repository;

import edu.ucsb.cs156.example.entities.UCSBMenuItemReview;

import org.springframework.data.repository.CrudRepository;

@Repository
public interface UCSBMenuItemReviewRepository extends CrudRepository<UCSBMenuItemReview, Long> {
    
}
