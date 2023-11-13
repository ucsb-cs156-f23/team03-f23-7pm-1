package edu.ucsb.cs156.example.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "ucsborganizations")
public class UCSBOrganization {
  @Id
  private String orgCode;
  private String orgTranslationShort;
  private String orgTranslation;
  private boolean inactive;
}