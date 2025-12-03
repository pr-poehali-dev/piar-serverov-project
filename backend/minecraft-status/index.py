import json
import os
import psycopg2
import socket
import struct
from typing import Dict, Any, Optional
import base64

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def ping_minecraft_server(host: str, port: int = 25565, timeout: int = 3) -> Optional[Dict[str, Any]]:
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        sock.connect((host, port))
        
        def send_packet(data: bytes):
            sock.send(struct.pack('B', len(data)) + data)
        
        def read_varint():
            value = 0
            for i in range(5):
                byte = sock.recv(1)
                if not byte:
                    return 0
                byte_val = struct.unpack('B', byte)[0]
                value |= (byte_val & 0x7F) << (7 * i)
                if not (byte_val & 0x80):
                    break
            return value
        
        handshake = b'\x00\x00' + host.encode('utf-8')
        handshake = struct.pack('B', len(handshake)) + handshake
        handshake += struct.pack('>H', port) + b'\x01'
        send_packet(handshake)
        
        send_packet(b'\x00')
        
        read_varint()
        read_varint()
        
        json_length = read_varint()
        json_data = sock.recv(json_length).decode('utf-8')
        
        sock.close()
        
        return json.loads(json_data)
    
    except Exception as e:
        return None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("SELECT id, ip FROM minecraft_servers")
        servers = cur.fetchall()
        
        updated_count = 0
        
        for server_id, ip in servers:
            host = ip.split(':')[0]
            port = int(ip.split(':')[1]) if ':' in ip else 25565
            
            status = ping_minecraft_server(host, port)
            
            if status:
                players = status.get('players', {}).get('online', 0)
                max_players = status.get('players', {}).get('max', 100)
                version = status.get('version', {}).get('name', 'Unknown')
                motd_data = status.get('description', {})
                
                if isinstance(motd_data, dict):
                    motd = motd_data.get('text', '')
                elif isinstance(motd_data, str):
                    motd = motd_data
                else:
                    motd = ''
                
                motd = motd.replace('§a', '').replace('§b', '').replace('§c', '').replace('§d', '').replace('§e', '').replace('§f', '').replace('§l', '').replace('§o', '').replace('§n', '').replace('§m', '').replace('§k', '').replace('§r', '')
                
                icon_data = status.get('favicon', '')
                icon_url = icon_data if icon_data.startswith('data:image') else None
                
                cur.execute("""
                    UPDATE minecraft_servers 
                    SET players = %s, max_players = %s, version = %s, 
                        is_online = true, last_checked = CURRENT_TIMESTAMP,
                        motd = %s, icon_url = %s
                    WHERE id = %s
                """, (players, max_players, version, motd, icon_url, server_id))
                
                updated_count += 1
            else:
                cur.execute("""
                    UPDATE minecraft_servers 
                    SET is_online = false, last_checked = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (server_id,))
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'updated': updated_count,
                'total': len(servers)
            }),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
