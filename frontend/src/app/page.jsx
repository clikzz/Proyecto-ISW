import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Bike, Wrench, Calendar, BarChart } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Bike className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Nombre</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6"></nav>
      </header>
      <main className="flex-1">
        <section className="w-full h-[calc(100vh-3.5rem)] flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  ProyectoISW
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Sapiente provident omnis ex deleniti. Sint officiis nihil nam
                  dignissimos distinctio perspiciatis enim, animi, expedita et
                  qui fugit quibusdam libero ea consectetur.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Regístrate</Button>
                <Button variant="outline">Inicia Sesión</Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="rounded-3xl w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="items-centercontainer px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              CaracterÃ­sticas principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Wrench className="w-8 h-8 mb-2" />
                  <CardTitle>Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Accusamus quod reiciendis in dolorum facere repudiandae
                    adipisci, recusandae dicta inventore magni assumenda omnis?
                    Architecto quae consequatur vero dolorem quibusdam,
                    repellendus nam!
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Calendar className="w-8 h-8 mb-2" />
                  <CardTitle>Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Ducimus, pariatur quisquam. Praesentium blanditiis qui culpa
                    est laboriosam doloremque totam enim! Fuga sapiente ratione
                    assumenda repellendus sed in dignissimos aut quibusdam?
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart className="w-8 h-8 mb-2" />
                  <CardTitle>Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Amet voluptatem, magnam velit recusandae, minima quis dolore
                    assumenda cupiditate dolor facere, vero ipsam consequatur
                    eaque sit? Odit dolorem amet obcaecati dolores!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">test </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Test
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Test
          </Link>
        </nav>
      </footer>
    </div>
  );
}
