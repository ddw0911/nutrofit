package nutrofit.domain.entity.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name="nutrition")
@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Nutrition {

  @Id
  @Column(name="product_id")
  private Long productId;

  @MapsId
  @OneToOne
  @JoinColumn(name = "product_id")
  private Product product;

  private Integer calories;
  private Integer carbo;
  private Integer protein;
  @Column(name = "saturated_fat")
  private Float saturatedFat;
  @Column(name="trans_fat")
  private Float transFat;
  private Integer cholesterol;
  private Integer sodium;
}
