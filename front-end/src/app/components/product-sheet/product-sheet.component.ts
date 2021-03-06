import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProduitService } from '../../services/produit.service';
import { PanierService } from '../../services/panier.service';
import { ProduitCommandeService } from '../../services/produit-commande.service';
import { Produit } from '../../model/model.produit';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ProduitCommande } from '../../model/model.produit-commande';
import { User } from '../../model/model.user';
import { Panier } from '../../model/model.panier';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-sheet',
  templateUrl: './product-sheet.component.html',
  styleUrls: ['../../app.component.css']
})
export class ProductSheetComponent implements OnInit {
  produit: Produit = new Produit();
  produitCommande: ProduitCommande = new ProduitCommande();
  produitsCommandes: ProduitCommande[] = [];
  errorMessage: string;
  id: number;
  currentUser: User;
  image :string = "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg";

  constructor(private produitService :ProduitService,
    private produitCommandeService :ProduitCommandeService,
    private panierService :PanierService,
    private authService :AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.produitCommande.panier = new Panier();
    this.produitCommande.produit = new Produit();
    this.getProduct();
    this.getPanier();
    this.getProduitsCommandes();
    this.produitCommande.quantite = 1;
  }

  getProduct(){
    let id = this.route.snapshot.paramMap.get('id');
    this.produitService.getOne(id)
      .subscribe(data => {
        this.produit = data;
        this.produitCommande.produit = data;
       }
      )
  }

  addToBasket() {
    var already = false;
    var toUpdate;

    for(let prodCom of this.produitsCommandes){
      if (prodCom.produit.id == this.produitCommande.produit.id){
        already = true;
        prodCom.quantite++;
        toUpdate = prodCom;
      }
    }
    if (already){
      this.produitCommandeService.update(toUpdate);
    }else{
      this.produitCommandeService.save(this.produitCommande);
    }
    this.router.navigate(['/basket']);
  }

  getPanier(){
    this.panierService.getOneByUser(this.currentUser.id)
      .subscribe(data => {
        this.produitCommande.panier = data; }
      )
  }

  getProduitsCommandes(){
    this.produitCommandeService.getByUser(this.currentUser.id)
      .subscribe(data => {
        this.produitsCommandes = data;} 
      )
      
  }

  logOut() {
    this.authService.logOut()
      .subscribe(
        data => {
          this.router.navigate(['/login']);
        },
        error => {

        });
  }
}
