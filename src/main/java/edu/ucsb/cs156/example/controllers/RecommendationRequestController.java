package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import java.time.LocalDateTime;

@Tag(name = "recommendationrequests")
@RequestMapping("/api/recommendationrequests")
@RestController
@Slf4j
public class RecommendationRequestController extends ApiController {

    @Autowired
    RecommendationRequestRepository recommendationRequestRepository;

    @Operation(summary= "List all recommendation requests")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<RecommendationRequest> allRecommendationRequests() {
        Iterable<RecommendationRequest> requests = recommendationRequestRepository.findAll();
        return requests;
    }

    @Operation(summary= "Create a new recommendation request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public RecommendationRequest postRecommendationRequest(
            @Parameter(name="requesterEmail") @RequestParam String requesterEmail,
            @Parameter(name="professorEmail") @RequestParam String professorEmail,
            @Parameter(name="explanation") @RequestParam String explanation,
            @Parameter(name="dateRequested", description="in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601") @RequestParam("dateRequested") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateRequested,
            @Parameter(name="dateNeeded", description="in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601") @RequestParam("dateNeeded") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateNeeded,
            @Parameter(name="done") @RequestParam boolean done)
            throws JsonProcessingException {

        log.info("dateRequested={} dateNeeded={}", dateRequested, dateNeeded);

        RecommendationRequest recRequest = new RecommendationRequest();
        recRequest.setRequesterEmail(requesterEmail);
        recRequest.setProfessorEmail(professorEmail);
        recRequest.setExplanation(explanation);
        recRequest.setDateRequested(dateRequested);
        recRequest.setDateNeeded(dateNeeded);
        recRequest.setDone(done);

        RecommendationRequest savedRecRequest = recommendationRequestRepository.save(recRequest);

        return savedRecRequest;
    }


    @Operation(summary= "Get a single recommendation request")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public RecommendationRequest getRecommendationRequest(
            @Parameter(name="id") @RequestParam Long id) {RecommendationRequest recommendationRequest = recommendationRequestRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

        return recommendationRequest;
    }

    @Operation(summary= "Delete a recommendation request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteRecommendationRequest(
            @Parameter(name="id", description="Id of recommendation request to delete", example="1") @RequestParam Long id) {
        RecommendationRequest recRequest = recommendationRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

        recommendationRequestRepository.delete(recRequest);
        return genericMessage("RecommendationRequest with id %s deleted".formatted(id));
    }


    @Operation(summary= "Update a recommendation request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public RecommendationRequest updateRecommendationRequest(
        @Parameter(name="id") @RequestParam Long id,
        @RequestBody @Valid RecommendationRequest incoming) {

        RecommendationRequest recRequest = recommendationRequestRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

        // recRequest.setRequesterEmail(incoming.getRequesterEmail());d
        recRequest.setProfessorEmail(incoming.getProfessorEmail());
        recRequest.setExplanation(incoming.getExplanation());
        recRequest.setDateRequested(incoming.getDateRequested());
        recRequest.setDateNeeded(incoming.getDateNeeded());
        recRequest.setDone(incoming.getDone());

        recommendationRequestRepository.save(recRequest);

        return recRequest;
    }
}


