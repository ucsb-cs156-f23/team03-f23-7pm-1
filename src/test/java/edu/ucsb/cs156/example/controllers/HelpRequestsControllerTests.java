package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.HelpRequests;
import edu.ucsb.cs156.example.repositories.HelpRequestsRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = HelpRequestsController.class)
@Import(TestConfig.class)
public class HelpRequestsControllerTests extends ControllerTestCase {

        @MockBean
        HelpRequestsRepository helpRequestsRepository;

        @MockBean
        UserRepository userRepository;

        // Tests for GET /api/ucsbdates/all
        
        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/helprequests/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/helprequests/all"))
                                .andExpect(status().is(200)); // logged
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_helpRequests() throws Exception {

                // arrange
                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                boolean result = Boolean.parseBoolean("true"); 
                HelpRequests helpRequest1 = HelpRequests.builder()
                 .requesterEmail("m@gmail.com")
                                .teamId("7pm-1")
                                .tableOrBreakoutRoom("t3")
                                .explanation("download")
                                .requestTime(ldt1)
                                .solved(result)
                                .build();

                LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");
                boolean result2 = Boolean.parseBoolean("true"); 
                HelpRequests helpRequest2 = HelpRequests.builder()
                 .requesterEmail("n@gmail.com")
                                .teamId("7pm-1")
                                .tableOrBreakoutRoom("t3")
                                .explanation("download")
                                .requestTime(ldt2)
                                .solved(result2)
                                .build();

                ArrayList<HelpRequests> helpRequests = new ArrayList<>();
                helpRequests.addAll(Arrays.asList(helpRequest1, helpRequest2));

                when(helpRequestsRepository.findAll()).thenReturn(helpRequests);

                // act
                MvcResult response = mockMvc.perform(get("/api/helprequests/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(helpRequestsRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(helpRequests);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // Tests for POST /api/ucsbdates/post...

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/helprequests/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/helprequests/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_help_request() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                boolean result = Boolean.parseBoolean("true"); 
                HelpRequests helpRequest = HelpRequests.builder()
                 .requesterEmail("m@gmail.com")
                                .teamId("2")
                                .tableOrBreakoutRoom("t3")
                                .explanation("download")
                                .requestTime(ldt1)
                                .solved(result)
                                .build();

                when(helpRequestsRepository.save(eq(helpRequest))).thenReturn(helpRequest);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/helprequests/post?requesterEmail=m@gmail.com&teamId=2&tableOrBreakoutRoom=t3&requestTime=2022-01-03T00:00:00&explanation=download&solved=true")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(helpRequestsRepository, times(1)).save(helpRequest);
                String expectedJson = mapper.writeValueAsString(helpRequest);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // Tests for GET /api/helprequests?id=...

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/helprequests?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

  

                // arrange
                LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");
                boolean result = Boolean.parseBoolean("true"); 

                HelpRequests helpRequest = HelpRequests.builder()
                                .requesterEmail("m@gmail.com")
                                .teamId("7pm-1")
                                .tableOrBreakoutRoom("table 3")
                                .explanation("download issue")
                                .requestTime(ldt)
                                .solved(result)
                                .build();

                when(helpRequestsRepository.findById(eq(7L))).thenReturn(Optional.of(helpRequest));

                // act
                MvcResult response = mockMvc.perform(get("/api/helprequests?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(helpRequestsRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(helpRequest);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(helpRequestsRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/helprequests?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(helpRequestsRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("HelpRequests with id 7 not found", json.get("message"));
        }


        // Tests for DELETE /api/ucsbdates?id=... 

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_date() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                boolean result = Boolean.parseBoolean("true"); 
                HelpRequests helpRequest = HelpRequests.builder()
                                .requesterEmail("m@gmail.com")
                                .teamId("7pm-1")
                                .tableOrBreakoutRoom("table 3")
                                .explanation("download issue")
                                .requestTime(ldt1)
                                .solved(result)
                                .build();

                when(helpRequestsRepository.findById(eq(15L))).thenReturn(Optional.of(helpRequest));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/helprequests?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(helpRequestsRepository, times(1)).findById(15L);
                verify(helpRequestsRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("HelpRequest with id 15 deleted", json.get("message"));
        }
        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_ucsbdate_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(helpRequestsRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/helprequests?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(helpRequestsRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("HelpRequests with id 15 not found", json.get("message"));
        }

        // Tests for PUT /api/ucsbdates?id=... 

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_helprequest() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2023-01-03T00:00:00");
                boolean result = Boolean.parseBoolean("true"); 
                boolean result2 = Boolean.parseBoolean("false"); 
                HelpRequests helpRequestOrig = HelpRequests.builder()
                                .requesterEmail("m@gmail.com")
                                .teamId("7pm-3")
                                .requestTime(ldt1)
                                .solved(result)
                                .explanation("download issue")
                                .tableOrBreakoutRoom("table 4")
                                .build();

                HelpRequests helpRequestEdited = HelpRequests.builder()
                                .requesterEmail("ma@gmail.com")
                                .teamId("7pm-1")
                                .requestTime(ldt2)
                                .solved(result2)
                                .explanation("downloading issue")
                                .tableOrBreakoutRoom("table 5")
                                .build();

                String requestBody = mapper.writeValueAsString(helpRequestEdited);

                when(helpRequestsRepository.findById(eq(67L))).thenReturn(Optional.of(helpRequestOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/helprequests?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(helpRequestsRepository, times(1)).findById(67L);
                verify(helpRequestsRepository, times(1)).save(helpRequestEdited); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_helprequest_that_does_not_exist() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                boolean result = Boolean.parseBoolean("true"); 
                HelpRequests helpRequestEdited = HelpRequests.builder()
                                .requesterEmail("m@gmail.com")
                                .teamId("7pm-1")
                                .requestTime(ldt1)
                                .solved(result)
                                .explanation("download issue")
                                .tableOrBreakoutRoom("table 4")
                                .build();

                String requestBody = mapper.writeValueAsString(helpRequestEdited);

                when(helpRequestsRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/helprequests?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(helpRequestsRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("HelpRequests with id 67 not found", json.get("message"));

        }
}
