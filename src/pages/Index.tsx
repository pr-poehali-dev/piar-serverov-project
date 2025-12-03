import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface MinecraftServer {
  id: string;
  name: string;
  ip: string;
  version: string;
  players: number;
  maxPlayers: number;
  description: string;
}

const Index = () => {
  const [servers, setServers] = useState<MinecraftServer[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    version: '',
    players: '',
    maxPlayers: '',
    description: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newServer: MinecraftServer = {
      id: Date.now().toString(),
      name: formData.name,
      ip: formData.ip,
      version: formData.version,
      players: parseInt(formData.players) || 0,
      maxPlayers: parseInt(formData.maxPlayers) || 0,
      description: formData.description
    };

    setServers([newServer, ...servers]);
    setFormData({
      name: '',
      ip: '',
      version: '',
      players: '',
      maxPlayers: '',
      description: ''
    });
    setIsFormOpen(false);
    
    toast({
      title: "Сервер добавлен! 🎮",
      description: "Ваш Minecraft сервер теперь на платформе",
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-body">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://cdn.poehali.dev/projects/80a3e06e-356a-434f-88ae-31b61557a306/files/2dd36d2d-1c68-4430-98e3-e3d4a0a570fb.jpg')`,
        }}
      />
      
      <div className="fixed inset-0 bg-gradient-to-b from-cosmic-dark/80 via-cosmic-dark/60 to-cosmic-dark/90" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDuration: Math.random() * 3 + 2 + 's',
              animationDelay: Math.random() * 2 + 's'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-float">
          <h1 className="text-6xl md:text-8xl font-heading font-bold mb-6 animate-rgb-glow">
            ПРОПЕАРЬ ТУТ<br/>СВОЙ СЕРВЕР!
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 mb-8 font-body">
            🚀 Лучшая платформа для продвижения Minecraft серверов
          </p>
          
          <Button 
            size="lg"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-heading font-bold text-xl px-8 py-6 rounded-xl shadow-2xl animate-pulse-glow transition-all duration-300 hover:scale-105"
          >
            <Icon name="Plus" className="mr-2" size={24} />
            Добавить свой сервер
          </Button>
        </div>

        {isFormOpen && (
          <Card className="max-w-2xl mx-auto mb-12 bg-card/40 backdrop-blur-lg border-2 border-primary/30 shadow-2xl animate-scale-in">
            <CardHeader>
              <CardTitle className="text-3xl font-heading flex items-center gap-2">
                <Icon name="Server" size={32} />
                Добавить Minecraft сервер
              </CardTitle>
              <CardDescription className="text-base">
                Заполните информацию о вашем сервере
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">Название сервера</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="bg-background/50 border-border/50"
                    placeholder="Мой крутой сервер"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ip" className="text-base">IP адрес</Label>
                  <Input
                    id="ip"
                    value={formData.ip}
                    onChange={(e) => setFormData({...formData, ip: e.target.value})}
                    required
                    className="bg-background/50 border-border/50"
                    placeholder="play.myserver.net"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="version" className="text-base">Версия</Label>
                    <Input
                      id="version"
                      value={formData.version}
                      onChange={(e) => setFormData({...formData, version: e.target.value})}
                      required
                      className="bg-background/50 border-border/50"
                      placeholder="1.20.4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="players" className="text-base">Игроков онлайн</Label>
                    <Input
                      id="players"
                      type="number"
                      value={formData.players}
                      onChange={(e) => setFormData({...formData, players: e.target.value})}
                      required
                      className="bg-background/50 border-border/50"
                      placeholder="42"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxPlayers" className="text-base">Макс. игроков</Label>
                    <Input
                      id="maxPlayers"
                      type="number"
                      value={formData.maxPlayers}
                      onChange={(e) => setFormData({...formData, maxPlayers: e.target.value})}
                      required
                      className="bg-background/50 border-border/50"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base">Описание</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    className="bg-background/50 border-border/50"
                    placeholder="Лучший выживание сервер с экономикой и РП!"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 font-heading font-semibold"
                  >
                    <Icon name="Check" className="mr-2" size={20} />
                    Добавить сервер
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                    className="border-border/50"
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {servers.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-heading font-bold mb-8 text-center flex items-center justify-center gap-3">
              <Icon name="Trophy" size={36} className="text-primary" />
              Серверы на платформе
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servers.map((server) => (
                <Card 
                  key={server.id} 
                  className="bg-card/40 backdrop-blur-lg border-2 border-accent/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group"
                >
                  <CardHeader>
                    <CardTitle className="text-2xl font-heading flex items-center gap-2 group-hover:text-primary transition-colors">
                      <Icon name="Gamepad2" size={24} />
                      {server.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-mono text-sm">
                      {server.ip}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon name="Users" size={18} className="text-primary" />
                        <span className="font-semibold">Онлайн</span>
                      </div>
                      <span className="font-bold text-xl text-primary">
                        {server.players}/{server.maxPlayers}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Tag" size={16} className="text-accent" />
                      <span className="text-muted-foreground">Версия:</span>
                      <span className="font-semibold text-accent">{server.version}</span>
                    </div>

                    <p className="text-sm text-muted-foreground pt-2 border-t border-border/30">
                      {server.description}
                    </p>

                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-accent to-cosmic-purple hover:from-accent/90 hover:to-cosmic-purple/90 font-heading"
                      onClick={() => {
                        navigator.clipboard.writeText(server.ip);
                        toast({
                          title: "IP скопирован! 📋",
                          description: `${server.ip} в буфере обмена`,
                        });
                      }}
                    >
                      <Icon name="Copy" className="mr-2" size={16} />
                      Скопировать IP
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {servers.length === 0 && !isFormOpen && (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-block p-8 bg-card/20 backdrop-blur-lg rounded-2xl border border-border/30">
              <Icon name="Rocket" size={64} className="mx-auto mb-4 text-primary" />
              <p className="text-xl text-muted-foreground font-body">
                Будь первым! Добавь свой сервер на платформу 🚀
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
