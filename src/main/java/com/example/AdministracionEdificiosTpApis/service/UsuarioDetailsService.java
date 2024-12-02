package com.example.AdministracionEdificiosTpApis.service;

import com.example.AdministracionEdificiosTpApis.data.UsuarioRepository;
import com.example.AdministracionEdificiosTpApis.model.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByNombreUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        String.format("Usuario con nombre '%s' no encontrado", username)));

        if (usuario.getRol() == null || usuario.getRol().getNombre() == null) {
            throw new IllegalStateException(
                    String.format("El usuario '%s' no tiene un rol asignado o el rol es inválido", username));
        }

        // Crear autoridades basadas en el rol del usuario
        GrantedAuthority authority = new SimpleGrantedAuthority(usuario.getRol().getNombre().toUpperCase());

        // Retornar instancia de UserDetails
        return new org.springframework.security.core.userdetails.User(
                usuario.getNombreUsuario(),
                usuario.getContrasena(),
                List.of(authority)
        );
    }

}






//package com.example.AdministracionEdificiosTpApis.service;
//
//import com.example.AdministracionEdificiosTpApis.model.Usuario;
//import com.example.AdministracionEdificiosTpApis.data.UsuarioDAO;
//import com.example.AdministracionEdificiosTpApis.data.UsuarioRepository;
//
//import java.util.Collection;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.AuthorityUtils;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//@Service
//public class UsuarioDetailsService implements UserDetailsService {
//
//    private final UsuarioDAO usuarioDAO;
//    
//    private final UsuarioRepository usuarioRepository;
//
//    
//
//    public UsuarioDetailsService(UsuarioDAO usuarioDAO, UsuarioRepository usuarioRepository) {
//        this.usuarioDAO = usuarioDAO;
//		this.usuarioRepository = usuarioRepository;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        Usuario usuario = usuarioRepository.findByNombreUsuario(username)
//                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
//
//        return new User(usuario.getNombreUsuario(), usuario.getContrasena(), getAuthorities(usuario));
//    }
//
//    private Collection<? extends GrantedAuthority> getAuthorities(Usuario usuario) {
//        return List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombre().toUpperCase()));
//    }
//
//
//
//}
