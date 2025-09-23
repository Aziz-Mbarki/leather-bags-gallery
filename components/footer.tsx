export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-foreground">Cuir Élégant</h3>
            <p className="text-sm text-muted-foreground">
              Maroquinerie de luxe depuis 1985. Savoir-faire artisanal et matériaux d'exception.
            </p>
          </div>

          {/* Collections */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Collections</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Sacs Homme
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Sacs Femme
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Sacs à dos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Portefeuilles
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Personnalisation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Réparation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Entretien
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Garantie
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>+216 71 123 456</li>
              <li>contact@cuir-elegant.tn</li>
              <li>
                Avenue Habib Bourguiba
                <br />
                Tunis, Tunisie
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Cuir Élégant. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
