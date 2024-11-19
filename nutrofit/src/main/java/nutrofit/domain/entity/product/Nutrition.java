package nutrofit.domain.entity.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name="nutrition")
@Data
@ToString(exclude = "{product}")
@AllArgsConstructor
@Builder
public class Nutrition {

  @Id
  private Long productId;

  @MapsId
  @OneToOne
  @JoinColumn(name = "product_id")
  private Product product;

  @Min(0)
  private Integer calories;
  @Min(0)
  private Integer carbo;
  @Min(0)
  private Integer protein;
  @Min(0)
  @Column(name = "saturated_fat")
  private Float saturatedFat;
  @Min(0)
  @Column(name="trans_fat")
  @Min(0)
  private Float transFat;
  @Min(0)
  private Integer cholesterol;
  @Min(0)
  private Integer sodium;
}
