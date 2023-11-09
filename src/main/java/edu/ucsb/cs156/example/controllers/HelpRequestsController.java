package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.HelpRequests;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.HelpRequestsRepository;

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

@Tag(name = "Help Requests")
@RequestMapping("/api/helprequests")
@RestController
@Slf4j
public class HelpRequestsController extends ApiController {

    @Autowired
    HelpRequestsRepository helpRequestsRepository;

    @Operation(summary= "List all help requests")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<HelpRequests> allHelpRequests() {
        Iterable<HelpRequests> reqs = helpRequestsRepository.findAll();
        return reqs;
    }

    @Operation(summary= "Create a new help request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public HelpRequests postHelpRequest(
            @Parameter(name="requesterEmail") @RequestParam String requesterEmail,
            @Parameter(name="teamId") @RequestParam String teamId
            ,
            @Parameter(name="tableOrBreakoutRoom") @RequestParam String tableOrBreakoutRoom,
            @Parameter(name="explanation") @RequestParam String explanation,
            @Parameter(name="solved") @RequestParam boolean solved,
            @Parameter(name="requestTime", description="in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601") @RequestParam("requestTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime requestTime)
            throws JsonProcessingException {

        // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        // See: https://www.baeldung.com/spring-date-parameters

        //log.info("localDateTime={}", localDateTime);

        HelpRequests helpRequest = new HelpRequests();
        helpRequest.setRequesterEmail(requesterEmail);
        helpRequest.setTeamId(teamId);
        helpRequest.setTableOrBreakoutRoom(tableOrBreakoutRoom);
        helpRequest.setExplanation(explanation);

        helpRequest.setRequestTime(requestTime);
        helpRequest.setSolved(solved);

        HelpRequests savedHelpRequest = helpRequestsRepository.save(helpRequest);

        return savedHelpRequest;
    }

    @Operation(summary= "Get a single help request by id")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public HelpRequests getById(
            @Parameter(name="id") @RequestParam Long id) {
        HelpRequests helpRequest = helpRequestsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(HelpRequests.class, id));

        return helpRequest;
    }

    @Operation(summary= "Delete a Help Request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteHelpRequests(
            @Parameter(name="id") @RequestParam Long id) {
        HelpRequests helpRequest = helpRequestsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(HelpRequests.class, id));

        helpRequestsRepository.delete(helpRequest);
        return genericMessage("HelpRequest with id %s deleted".formatted(id));
    }

    @Operation(summary= "Update a help request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public HelpRequests updateHelpRequests(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid HelpRequests incoming) {

        HelpRequests helpRequest = helpRequestsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(HelpRequests.class, id));
        helpRequest.setRequesterEmail(incoming.getRequesterEmail());
        helpRequest.setTeamId(incoming.getTeamId());
        helpRequest.setTableOrBreakoutRoom(incoming.getTableOrBreakoutRoom());
        helpRequest.setExplanation(incoming.getExplanation());
        helpRequest.setRequestTime(incoming.getRequestTime());
        helpRequest.setSolved(incoming.getSolved());
        
        helpRequestsRepository.save(helpRequest);

        return helpRequest;
    }
}
