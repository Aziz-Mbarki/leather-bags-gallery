"use client"

import { MessageCircle, Palette, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CustomBagSection() {
  return (
    <section className="py-16 animate-fade-in-up">
      <Card className="bg-gradient-to-br from-secondary to-muted border-border">
        <CardContent className="p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Créez Votre Sac Personnalisé</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Vous avez un sac personnalisé en tête ? Notre équipe d'artisans peut donner vie à vos idées avec des
              matériaux de première qualité et un savoir-faire exceptionnel.
            </p>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Design Unique</h3>
                <p className="text-sm text-muted-foreground">
                  Choisissez couleurs, textures et finitions selon vos goûts
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <Scissors className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Artisanat Expert</h3>
                <p className="text-sm text-muted-foreground">Confectionné à la main par nos maîtres maroquiniers</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Suivi Personnel</h3>
                <p className="text-sm text-muted-foreground">Accompagnement de A à Z dans votre projet</p>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Discutons de votre projet
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
