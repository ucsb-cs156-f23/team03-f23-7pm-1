package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.HelpRequests;

import org.springframework.data.repository.CrudRepository;

import org.springframework.stereotype.Repository;




@Repository
public interface HelpRequestsRepository extends CrudRepository<HelpRequests, Long> {
  
}
