import Header from '@/components/Header'
import Hero from '@/components/Hero'
import BentoGrid from '@/components/BentoGrid'
import TeamSection from '@/components/TeamSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="container-fluid">
      <Header />

      <main>
        <Hero />
        <BentoGrid />
        <TeamSection />
      </main>

      <Footer />
    </div>
  )
}
