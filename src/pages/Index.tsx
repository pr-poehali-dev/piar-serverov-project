import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface MinecraftServer {
  id: number;
  name: string;
  ip: string;
  version: string;
  players: number;
  maxPlayers: number;
  description: string;
  isOnline?: boolean;
  addedAt?: string;
}

const API_URL = 'https://functions.poehali.dev/c03fddbf-216c-45a4-848c-2a3e2792f072';

const Index = () => {
  const [servers, setServers] = useState<MinecraftServer[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    version: '',
    description: ''
  });
  const { toast } = useToast();

  const loadServers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setServers(data.servers || []);
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить список серверов",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServers();
    const interval = setInterval(loadServers, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalPlayers = servers.reduce((sum, server) => sum + server.players, 0);
  const totalServers = servers.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          ip: formData.ip,
          version: formData.version || '1.20',
          description: formData.description
        })
      });

      if (response.ok) {
        await loadServers();
        setFormData({
          name: '',
          ip: '',
          version: '',
          description: ''
        });
        setIsFormOpen(false);
        
        toast({
          title: "Сервер добавлен! 🎮",
          description: "Ваш Minecraft сервер теперь на платформе",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить сервер",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано! 📋",
      description: `IP ${text} скопирован в буфер обмена`,
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
          <p className="text-xl md:text-2xl text-foreground/90 mb-4 font-body">
            🚀 Лучшая платформа для продвижения Minecraft серверов
          </p>
          
          {totalServers > 0 && (
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="bg-card/40 backdrop-blur-lg px-6 py-3 rounded-xl border border-primary/30">
                <div className="flex items-center gap-2">
                  <Icon name="Server" size={24} className="text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Всего серверов</p>
                    <p className="text-2xl font-bold text-primary">{totalServers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-card/40 backdrop-blur-lg px-6 py-3 rounded-xl border border-accent/30">
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={24} className="text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Игроков онлайн</p>
                    <p className="text-2xl font-bold text-accent">{totalPlayers}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
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

                <div className="space-y-2">
                  <Label htmlFor="version" className="text-base">Версия</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => setFormData({...formData, version: e.target.value})}
                    className="bg-background/50 border-border/50"
                    placeholder="1.20.4"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base">Описание</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="bg-background/50 border-border/50"
                    placeholder="Выживание с модами и кастомными квестами"
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    <Icon name="Check" className="mr-2" size={20} />
                    Добавить сервер
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center text-2xl">
            <Icon name="Loader2" className="animate-spin inline-block" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server) => (
              <Card 
                key={server.id} 
                className="bg-card/40 backdrop-blur-lg border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-scale-in"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-heading flex items-center gap-2 mb-2">
                        <Icon name="Gamepad2" size={28} className="text-primary" />
                        {server.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {server.description || 'Без описания'}
                      </CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${server.isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {server.isOnline ? '● Онлайн' : '○ Оффлайн'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Версия:</span>
                    <span className="font-bold text-primary">{server.version}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Icon name="Users" size={16} />
                      Игроки:
                    </span>
                    <span className="font-bold text-accent">
                      {server.players} / {server.maxPlayers}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Globe" size={16} className="text-muted-foreground" />
                      <span className="text-sm font-mono text-foreground/80">{server.ip}</span>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(server.ip)}
                      variant="outline"
                      className="w-full bg-primary/10 hover:bg-primary/20 border-primary/30"
                    >
                      <Icon name="Copy" className="mr-2" size={16} />
                      Скопировать IP
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && servers.length === 0 && (
          <div className="text-center py-16">
            <Icon name="Server" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-2xl text-muted-foreground">
              Пока нет серверов. Будьте первым! 🚀
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
